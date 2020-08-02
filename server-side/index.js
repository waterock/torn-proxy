require('dotenv').config();
const crypto = require('crypto');
const secret = Buffer.from(process.env.ENCRYPTION_SECRET, 'base64');
const express = require('express');
const cookieParser = require('cookie-parser')
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
    return await database.query('select `key`, `user_id`, `description`, `created_at` from `keys` where `user_id` = ? order by `created_at` asc', [userId]);
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

    const [iv, encryptedKey] = encryption.encrypt(secret, request.body.key);

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

app.listen(port, () => console.log(`TORN proxy server listening at http://localhost:${port}`));
