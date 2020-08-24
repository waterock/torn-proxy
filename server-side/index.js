require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser')
const proxy = require('express-http-proxy');
const app = express();
if (process.env.NODE_ENV === 'development') {
    const cors = require('cors');
    app.use(cors({ origin: true, credentials: true }));
}
app.use(express.json());
app.use(cookieParser());
const encryption = require('./encryption.js');
const database = require('./database');
const fetch = require('node-fetch');
const jsonwebtoken = require('jsonwebtoken');
const jwt = require('./jwt');

const PORT = 3001;
const PROXY_KEY_LENGTH = 32;

async function getKeysForUserId(userId) {
    return await database.query([
        'select `key`, `user_id`, `description`, `created_at`, `revoked_at`',
        'from `keys`',
        'where `user_id` = ?',
        'order by `created_at` asc',
    ].join(' '), [userId]);
}

function getCookieOptions() {
    return {
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
        sameSite: true,
    };
}

// returns tuple [decrypted_torn_key: string | null, revoked: bool]
async function getTornKey(proxyKey) {
    const [record] = await database.query([
        'select `iv`, `torn_key`, `revoked_at`',
        'from `users`',
        'inner join `keys` on `keys`.`user_id` = `users`.`id`',
        'where `key` = ?',
    ].join(' '), [proxyKey]);

    if (record === undefined) {
        return [null, false];
    }

    return [
        encryption.decrypt(record.iv, record.torn_key),
        record.revoked_at !== null,
    ];
}

function getParamsArray(request, tornKey) {
    return Object.entries({ ...request.query, key: tornKey })
        .map(([key, value]) => `${key}=${value}`);
}

function getProxyError(keyRevoked = false) {
    return {
        proxy: true,
        proxy_code: keyRevoked ? 2 : 1,
        proxy_error: keyRevoked ? 'Key revoked' : 'Key not found',
    };
}

function resolvePathForTornStats(request) {
    return new Promise(async (resolve, reject) => {
        if ((request.query.key || '').length !== PROXY_KEY_LENGTH) {
            request._error = {
                error: 'ERROR: User not found.',
                ...getProxyError(),
            };
            return reject();
        }

        const [tornKey, revoked] = await getTornKey(request.query.key);
        if (tornKey === null || revoked) {
            request._error = {
                error: 'ERROR: User not found.',
                ...getProxyError(revoked),
            };
            return reject();
        }

        resolve('/api.php?' + getParamsArray(request, tornKey).join('&'));
    });
}

function resolvePathForTorn(request) {
    return new Promise(async (resolve, reject) => {
        if ((request.query.key || '').length !== PROXY_KEY_LENGTH) {
            request._error = {
                code: 2,
                error: 'Incorrect Key',
                ...getProxyError(),
            };
            return reject();
        }

        const [tornKey, revoked] = await getTornKey(request.query.key);
        if (tornKey === null || revoked) {
            request._error = {
                code: 2,
                error: 'Incorrect Key',
                ...getProxyError(revoked),
            };
            return reject();
        }

        const endpoint = request.url.split('?').shift();
        const params = getParamsArray(request, tornKey);

        resolve(`${endpoint}?${params.join('&')}`);
    });
}

const proxyOptions = {
    https: true,
    proxyReqPathResolver(request) {
        if (request.url.startsWith('/tornstats/api.php')) {
            return resolvePathForTornStats(request);
        }
        return resolvePathForTorn(request);
    },
};

app.post('/api/authenticate', async (request, response) => {
    const result = await fetch('https://api.torn.com/user/?selections=basic&key=' + request.body.key);
    const json = await result.json();
    const { error, player_id, name } = json;

    if (error) {
        response.status(401);
        return response.json(error);
    }

    const [iv, encryptedKey] = encryption.encrypt(request.body.key);

    const insertOrUpdateUserQuery = 'insert into users (`id`, `name`, `iv`, `torn_key`) values (?, ?, ?, ?) on duplicate key update `name` = values(`name`), `iv` = values(`iv`), `torn_key` = values(`torn_key`)';
    await database.query(insertOrUpdateUserQuery, [player_id, name, iv, encryptedKey]);

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    const sub = player_id.toString();
    const iat = Math.floor(Date.now() / 1000);
    const exp = Math.floor(expires / 1000);

    jsonwebtoken.sign(
        { sub, iat, exp },
        Buffer.from(process.env.JWT_SECRET, 'base64'),
        (error, token) => {
            response.cookie('jwt', token, { ...getCookieOptions(), expires });
            return response.json({ id: player_id, name });
        }
    );
});

app.get('/api/me', async (request, response) => {
    try {
        const userId = await jwt.getUserId(request.cookies.jwt);
        const results = await database.query('select `id`, `name` from `users` where `id` = ?', [userId]);
        const [user] = results;
        if (user === undefined) {
            throw Error(`User [${userId}] not found`);
        }
        return response.json(user);
    } catch (error) {
        return response.status(401).json({ error_message: error.message });
    }
});

app.post('/api/lock', (request, response) => {
    return response
        .clearCookie('jwt', getCookieOptions())
        .status(201)
        .json({});
});

app.get('/api/keys', async (request, response) => {
    try {
        const userId = await jwt.getUserId(request.cookies.jwt);
        const keys = await getKeysForUserId(userId);
        return response.json(keys);
    } catch (error) {
        return response.status(401).json({ error_message: error.message });
    }
});

app.post('/api/keys', async (request, response) => {
    try {
        const userId = await jwt.getUserId(request.cookies.jwt);
        await database.query('insert into `keys` (`key`, `user_id`, `description`) values (?, ?, ?)', [
            crypto.randomBytes(16).toString('hex'),
            userId,
            request.body.description.trim().substr(0, 255),
        ]);
        const keys = await getKeysForUserId(userId);
        return response.json(keys);
    } catch (error) {
        return response.status(401).json({ error_message: error.message });
    }
});

app.put('/api/keys/:key', async (request, response) => {
    const revokedAt = typeof request.body.revoked_at === 'string'
        ? new Date(request.body.revoked_at)
        : null;

    try {
        const userId = await jwt.getUserId(request.cookies.jwt);
        await database.query('update `keys` set `revoked_at` = ? where `key` = ? and user_id = ?', [
            revokedAt,
            request.params.key,
            userId,
        ]);
        const keys = await getKeysForUserId(userId);
        return response.json(keys);
    } catch (error) {
        return response.status(401).json({ error_message: error.message });
    }
});

app.get('/tornstats/api.php', proxy('www.tornstats.com', proxyOptions), (request, response) => {
    response
        .status(400) // tornstats.com uses 400 for invalid requests
        .json(request._error || {
            error: 'ERROR: Undefined error.',
            proxy: true,
        });
});

app.get('/*', proxy('api.torn.com', proxyOptions), (request, response) => {
    response.json(request._error || {
        code: 0,
        error: 'Undefined error',
        proxy: true,
    });
});

app.listen(PORT, () => console.log(`TORN proxy server listening at http://localhost:${PORT}`));
