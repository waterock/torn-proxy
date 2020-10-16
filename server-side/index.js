require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser')
const proxy = require('express-http-proxy');
const app = express();
const cors = require('cors');
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: true, credentials: true }));
} else {
    app.use(cors({ origin: /^https:\/\/(www\.)?torn-proxy\.com$/, credentials: true }));
}
app.use(express.json());
app.use(cookieParser());
const encryption = require('./encryption.js');
const database = require('./database');
const fetch = require('node-fetch');
const jsonwebtoken = require('jsonwebtoken');
const jwt = require('./jwt');
const getKey = require('./middlewares/getKey');
const errorIfKeyNotFound = require('./middlewares/errorIfKeyNotFound');
const errorIfKeyRevoked = require('./middlewares/errorIfKeyRevoked');
const errorIfNoPermission = require('./middlewares/errorIfNoPermission');
const getRequestedResource = require('./middlewares/getRequestedResource');
const getRequestedSelections = require('./middlewares/getRequestedSelections');
const getProxyPathForTornRequest = require('./middlewares/getProxyPathForTornRequest');

const PORT = 3001;

async function getAllKeys(userId) {
    return await database.query([
        'select `key`, `user_id`, `description`, `permissions`, `created_at`, `revoked_at`',
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

const proxyOptions = {
    https: true,
    proxyReqPathResolver(req) {
        // if (isTornStatsApiRequest(request)) {
        //     return '/api.php?' + getParamsArray(request).join('&');
        // }
        return req.locals.proxyPath;
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
        const keys = await getAllKeys(userId);
        return response.json(keys);
    } catch (error) {
        return response.status(401).json({ error_message: error.message });
    }
});

app.post('/api/keys', async (request, response) => {
    try {
        const userId = await jwt.getUserId(request.cookies.jwt);
        await database.query('insert into `keys` (`key`, `user_id`, `description`, `permissions`) values (?, ?, ?, ?)', [
            crypto.randomBytes(16).toString('hex'),
            userId,
            request.body.description.trim().substr(0, 255),
            '*',
        ]);
        const keys = await getAllKeys(userId);
        return response.json(keys);
    } catch (error) {
        return response.status(401).json({ error_message: error.message });
    }
});

app.put('/api/keys/:key', async (request, response) => {
    let userId;
    try {
        userId = await jwt.getUserId(request.cookies.jwt);
    } catch (error) {
        return response.status(401).json({ error_message: error.message });
    }

    const updates = {};
    if (request.body.revoked_at !== undefined) {
        updates.revoked_at = typeof request.body.revoked_at === 'string'
            ? new Date(request.body.revoked_at)
            : null;
    }
    if (['*', 'public'].includes(request.body.permissions)) {
        updates.permissions = request.body.permissions;
    }

    const updateQuery = [
        'update `keys` set',
        Object.keys(updates).map(field => `${field} = ?`).join(', '),
        'where `key` = ? and `user_id` = ?'
    ].join(' ');

    await database.query(updateQuery, [
        ...Object.values(updates),
        request.params.key,
        userId,
    ]);
    const keys = await getAllKeys(userId);

    response.json(keys);
});

// app.get('/tornstats/api.php', validateKey, checkPermissions, proxy('www.tornstats.com', proxyOptions), (request, response) => {
//     response
//         .status(400) // tornstats.com uses 400 for invalid requests
//         .json(request._error || {
//             error: 'ERROR: Undefined error.',
//             proxy: true,
//         });
// });

// Make sure this route comes last as a catch-all
app.get(
    '/*',
    getKey,
    errorIfKeyNotFound({
        code: 2,
        error: 'Incorrect Key',
        proxy: true,
        proxy_code: 1,
        proxy_error: 'Key not found',
    }),
    errorIfKeyRevoked({
        code: 2,
        error: 'Incorrect Key',
        proxy: true,
        proxy_code: 2,
        proxy_error: 'Key revoked',
    }),
    getRequestedResource,
    getRequestedSelections,
    errorIfNoPermission({
        code: 7,
        error: 'Incorrect ID-entity relation',
        proxy: true,
        proxy_code: 3,
        proxy_error: 'Key forbids access to {subject}: {details}',
    }),
    getProxyPathForTornRequest,
    proxy('api.torn.com', proxyOptions),
    (req, res) => res.json({
        code: 0,
        error: 'Unknown error',
        proxy: true,
        proxy_code: 0,
        proxy_error: 'Failed to proxy request to/from torn.com',
    }),
);

app.listen(PORT, () => console.log(`TORN proxy server listening at http://localhost:${PORT}`));
