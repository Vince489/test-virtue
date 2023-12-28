const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Token = require("./model");
const Keypair = require("./../../utils/keypair");




// Create token 
router.post('/', async (req, res) => {
  try {
    // Validate input data
    const { 
      uri, 
      symbol, 
      name, 
      mintAuthority, 
      freezeAuthority
     } = req.body;
    
    // Perform validation checks, e.g., checking if required fields are present

    if (!symbol || !name) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Generate a key pair using the Keypair library
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey;

    // Check if token already exists in the database with the same publicKey, symbol, or name
    const existingToken = await Token.findOne({ $or: [{ mint: publicKey }, { symbol }, { name }] });


    if (existingToken) {
      return res.status(400).json({ error: 'Token with the same address, symbol, or name already exists.' });
    }    

    // Create the token
    const token = new Token({
      uri,
      symbol,
      name,
      mint: publicKey,
      mintAuthority,
      freezeAuthority,
    });

    // Save the token to the database
    await token.save();

    res.status(200).json({ message: 'Token created successfully.', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;


