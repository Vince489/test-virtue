const { encryptData, decryptData } = require('./encrypt-decrypt'); 
require("dotenv").config();

const secret = process.env.SECRET_KEY;

// data to encrypt
const data = 'magic kingdom';
console.log('Original data:', data);

// encrypt data
const eData = encryptData(data, secret);
console.log('Encrypted data:', eData);

// decrypt data
const deData = decryptData(eData, secret);
console.log('Decrypted data:', deData);

// data to encrypt
const data1 = 'magic kingdom bottom ran planet escape';
console.log('Original data1:', data1);

// encrypt data
const eData1 = encryptData(data1, secret);
console.log('Encrypted eData1:', eData1);

// decrypt data
const deData1 = decryptData(eData1, secret);
console.log('Decrypted data:', deData1);