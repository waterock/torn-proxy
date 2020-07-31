const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

module.exports = {
    encrypt(secret, value) {
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);
        let encrypted = cipher.update(value);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return [iv.toString('hex'), encrypted.toString('hex')];
    },
    decrypt(secret, iv, value) {
        let ivBuffer = Buffer.from(iv, 'hex');
        let encryptedText = Buffer.from(value, 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret), ivBuffer);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
};
