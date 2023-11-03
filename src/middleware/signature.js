const Keypair = require('../utils/keypair');

const verifySignature = async (req, res, next) => {
    const { message, signature, publicKey } = req.body; 

    try {
        // Verify the message signature
        if (Keypair.verify(message, signature, publicKey)) {
          // Signature is valid
          next();
        } else {
          // Signature is not valid, respond with an error
          res.status(400).json({ error: 'Invalid signature' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Signature verification failed' });
      }
    };

module.exports = verifySignature;
