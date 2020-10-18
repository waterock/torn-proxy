const database = require('../database');
const encryption = require('../encryption.js');
const PROXY_KEY_LENGTH = 32;

async function getKey(proxyKey) {
    if (typeof proxyKey !== 'string' || proxyKey.length !== PROXY_KEY_LENGTH) {
        return null;
    }

    const [record] = await database.query([
        'select `permissions`, `revoked_at`, `iv`, `torn_key` as `encrypted_torn_key`',
        'from `users` inner join `keys` on `keys`.`user_id` = `users`.`id`',
        'where `key` = ?',
    ].join(' '), [proxyKey]);

    if (record === undefined) {
        return null;
    }

    return {
        torn_key: encryption.decrypt(record.iv, record.encrypted_torn_key),
        permissions: record.permissions,
        is_revoked: record.revoked_at !== null,
    };
}

module.exports = async (req, res, next) => {
    req.locals = {
        ...req.locals,
        key: await getKey(req.query.key),
    };
    next();
};
