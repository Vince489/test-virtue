const bs58 = require("bs58");
const nacl = require("sodium-native");

// Retrieve keys from MongoDB (example)
const publicKeyBase58 = "..." // Retrieved public key as Base58-encoded string
const privateKeyBase58 = "..." // Retrieved private key as Base58-encoded string

// Decode keys
const publicKey = bs58.decode(publicKeyBase58);
const privateKey = bs58.decode(privateKeyBase58);

// Sign a message
const message = "Your message here";
const messageData = new TextEncoder().encode(message);
const signature = nacl.sign.detached(messageData, privateKey);
const signatureBase58 = bs58.encode(signature);

console.log("Signed Message:", message);
console.log("Signature:", signatureBase58);
