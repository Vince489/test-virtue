const { encryptData, decryptData } = require('./src/utils/encrypt-decrypt'); 
require("dotenv").config();

const secret = process.env.SECRET_KEY;

// data to encrypt
const data = 'magic kingdom';
console.log('Original data:', data);

// data to encrypt 2
const data2 = 'magic kingdom';
console.log('Original data2:', data2);

// encrypt data
const eData = encryptData(data, secret);
console.log('Encrypted data:', eData);

// encrypt data 2
const eData2 = encryptData(data2, secret);
console.log('Encrypted data:', eData2);

// decrypt data
const deData = decryptData(eData, secret);
console.log('Decrypted data:', deData);