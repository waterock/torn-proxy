const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

module.exports = {
    encrypt(value) {
        const secret = Buffer.from(process.env.ENCRYPTION_SECRET, 'base64');
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, secret, iv);
        let encrypted = cipher.update(value);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return [iv.toString('base64'), encrypted.toString('base64')];
    },
    decrypt(ivBase64, valueBase64) {
        const secret = Buffer.from(process.env.ENCRYPTION_SECRET, 'base64');
        const iv = Buffer.from(ivBase64, 'base64');
        const decipher = crypto.createDecipheriv(algorithm, secret, iv);
        const encrypted = Buffer.from(valueBase64, 'base64');
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
};
