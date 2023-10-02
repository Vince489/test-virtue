const crypto = require('crypto');

// Generate a secure 256-bit secret key (32 bytes)
const secretKey = crypto.randomBytes(32);
console.log('Generated Secret Key:', secretKey.toString('hex'));

const iv = crypto.randomBytes(16); // 16 bytes for the IV
console.log('Generated IV:', iv.toString('hex'));

// Function to encrypt data
function encryptData(data) {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
}

// Function to decrypt data
function decryptData(encryptedData) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
}

module.exports = { encryptData, decryptData };

