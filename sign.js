const bs58 = require("bs58");
const nacl = require("tweetnacl");

// Retrieve keys from MongoDB (example)
const publicKeyBase58 = "DdkCHrvh9YuCz9UJmVxt8bCMx45SEVoY9Q95xB3GfpE4" // Retrieved public key as Base58-encoded string
const privateKeyBase58 = "3tK27Nb8ok7waWbYYFTz39cPcAihuYibNoBhqakioABaVGxN57rHjbW6sL2fMGQssxUsEeTTsxWqjZBsdBi3rSKr" // Retrieved private key as Base58-encoded string

// Decode keys
const privateKey = bs58.decode(privateKeyBase58);

// Sign a message
const message = "Your message here";
const messageData = new TextEncoder().encode(message);
const signature = nacl.sign.detached(messageData, privateKey);
const signatureBase58 = bs58.encode(signature);

console.log("Signed Message:", message);
console.log("Signature:", signatureBase58);

// Verify a signature
const publicKeyData = bs58.decode(publicKeyBase58);
const signatureData = bs58.decode(signatureBase58);
const isValid = nacl.sign.detached.verify(messageData, signatureData, publicKeyData);
console.log("Signature is valid:", isValid);
