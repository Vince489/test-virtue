const CryptoJS = require('crypto-js');

// Encryption function
function encryptData(data, secret) {
  const ciphertext = CryptoJS.AES.encrypt(data, secret).toString();
  return ciphertext;
}

// Decryption function
function decryptData(ciphertext, secret) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

module.exports = { encryptData, decryptData };