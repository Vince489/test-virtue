const nacl = require('tweetnacl');
const bs58 = require('bs58');

class Keypair {
  constructor() {
    try {
      const { publicKey, secretKey } = nacl.sign.keyPair();
      if (!publicKey || !secretKey) {
        throw new Error('Could not generate keypair');
      }
      this.publicKey = bs58.encode(publicKey);
      this.privateKey = bs58.encode(secretKey);
    } catch (error) {
      throw new Error(`Could not generate key pair: ${error.message}`);
    }
  }

  static generate() {
    try {
      return new Keypair();
    } catch (error) {
      throw new Error(`Failed to generate key pair: ${error.message}`);
    }
  }

  sign(message) {
    try {
      const privateKey = bs58.decode(this.privateKey);
      const messageData = new TextEncoder().encode(message);
      const signature = nacl.sign.detached(messageData, privateKey);
      if (!signature) {
        throw new Error('Message signing failed');
      }
      return bs58.encode(signature);
    } catch (error) {
      throw new Error('Failed to sign message: ' + error.message);
    }
  }
  
  static verify(message, signature, publicKey) {
    try {
      const messageData = new TextEncoder().encode(message);
      const signatureData = bs58.decode(signature);
      const publicKeyData = bs58.decode(publicKey);
      const isValid = nacl.sign.detached.verify(messageData, signatureData, publicKeyData);
      if (!isValid) {
        throw new Error('Signature verification failed');
      }
      return isValid;
    } catch (error) {
      throw new Error('Failed to verify signature: ' + error.message);
    }
  }
}  


module.exports = Keypair;