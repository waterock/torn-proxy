const jsonwebtoken = require('jsonwebtoken');

module.exports = {
    getUserId(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken.verify(token, Buffer.from(process.env.JWT_SECRET, 'base64'), {}, async (error, decoded) => {
                if (error) {
                    return reject(error);
                }
                const userId = parseInt(decoded.sub, 10);
                return resolve(userId);
            });
        });
    }
};
