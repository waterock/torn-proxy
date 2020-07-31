require('dotenv').config();
const crypto = require('crypto');
const secret = Buffer.from(process.env.ENCRYPTION_SECRET, 'base64');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;
const encryption = require('./encryption.js');
const database = require('./database');
const fetch = require('node-fetch');

const getKeysForUserId = async (userId) => {
    return await database.query('select `key`, user_id, description, created_at from `keys` where user_id = ? order by created_at asc', [userId]);
};

app.post('/authenticate', async (request, response) => {
    const result = await fetch('https://api.torn.com/user/?selections=basic&key=' + request.body.key);
    const json = await result.json();
    const { error, player_id, name } = json;

    if (error) {
        response.status(401);
        return response.json(error);
    }

    const [iv, encryptedKey] = encryption.encrypt(secret, request.body.key);

    const insertOrUpdateUserQuery = `
    insert into users (id, name, iv, torn_key)
    values (?, ?, ?, ?)
    on duplicate key update
      name = values(name),
      iv = values(iv),
      torn_key = values(torn_key)`;

    await database.query(insertOrUpdateUserQuery, [player_id, name, iv, encryptedKey]);

    return response.json({ id: player_id, name });
});

app.get('/keys', async (request, response) => {
    const keys = await getKeysForUserId(request.query.user_id);
    return response.json(keys);
});

app.post('/keys', async (request, response) => {
    await database.query('insert into `keys` (`key`, user_id, description) values (?, ?, ?)', [
        crypto.randomBytes(16).toString('hex'),
        request.body.user_id,
        request.body.description.trim().substr(0, 255),
    ]);

    const keys = await getKeysForUserId(request.body.user_id);
    return response.json(keys);
});

app.listen(port, () => console.log(`TORN proxy server listening at http://localhost:${port}`));
