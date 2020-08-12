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
const port = 3001;
const encryption = require('./encryption.js');
const database = require('./database');
const fetch = require('node-fetch');
const jsonwebtoken = require('jsonwebtoken');
const jwt = require('./jwt');

const getKeysForUserId = async (userId) => {
    return await database.query([
        'select `key`, `user_id`, `description`, `created_at`, `revoked_at`',
        'from `keys`',
        'where `user_id` = ?',
        'order by `created_at` asc',
    ].join(' '), [userId]);
};

const getCookieOptions = () => {
    return {
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
        sameSite: true,
    };
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

app.update('/api/keys', async (request, response) => {
    const action = request.query.action;

    try {
        const userId = await jwt.getUserId(request.cookies.jwt);

        switch (action) {
            case 'revoke':
                await database.query('update `keys` set `revoked_at` = ? where `key` = ?', [
                    new Date(),
                    request.query.key || '',
                ]);
                break;
            case 'reinstate':
                await database.query('update `keys` set `revoked_at` = ? where `key` = ?', [
                    null,
                    request.query.key || '',
                ]);
                break;
            default:
                // unknown command
                break;
        }
        const keys = await getKeysForUserId(userId);
        return response.json(keys);
    } catch (error) {
        return response.status(401).json({ error_message: error.message });
    }
});

app.use('/', proxy('api.torn.com', {
    https: true,
    proxyReqPathResolver(request) {
        return new Promise(async (resolve, reject) => {
            if ((request.query.key || '').length !== 32) {
                request._error = {
                    code: 2,
                    error: 'use a proxy key (32 hex characters)',
                    proxy: true,
                };
                return reject();
            }

            const params = { ...request.query };
            delete params.key;

            const sql = 'select `iv`, `torn_key` from `users` inner join `keys` on `keys`.`user_id` = `users`.`id` where `key` = ? and `revoked_at` is null';
            const [encryptedKey] = await database.query(sql, [request.query.key]);

            if (encryptedKey === undefined) {
                request._error = {
                    code: 2,
                    error: 'invalid proxy key',
                    proxy: true,
                };
                return reject();
            }

            params.key = encryption.decrypt(encryptedKey.iv, encryptedKey.torn_key);
            const paramsArray = Object.entries(params).map(([key, value]) => `${key}=${value}`);

            resolve(request.url.split('?').shift() + '?' + paramsArray.join('&'));
        });
    },
})).get('/', (request, response) => {
    // this only executes if the proxy middleware rejects
    response
        .status(401)
        .json(request._error || {
            code: 0,
            error: 'undefined error',
            proxy: true,
        });
});

app.listen(port, () => console.log(`TORN proxy server listening at http://localhost:${port}`));
