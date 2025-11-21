const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

// Key must be 32 bytes. Using the one from ENV.
// Note: In production, ensure the key is exactly 32 bytes.
const secretKey = process.env.AES_SECRET_KEY; 
const key = Buffer.from(secretKey.padEnd(32).slice(0, 32), 'utf8'); // Ensure 32 bytes
const ivLength = 16;

exports.encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (err) {
    console.error("Encryption Error:", err);
    return text;
  }
};

exports.decrypt = (text) => {
  if (!text) return text;
  try {
    const textParts = text.split(':');
    if (textParts.length < 2) return text; 
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    console.error("Decryption Error:", err);
    return text;
  }
};