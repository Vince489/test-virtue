const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Token = require("./model");

// Create token 
router.post('/', auth, async (req, res) => {
  try {
    // Validate input data
    const { address, uri, symbol, name, mintAuthority, freezeAuthority, decimals, supply, balance, type } = req.body;
    
    // Perform validation checks, e.g., checking if required fields are present

    if (!address || !symbol || !name) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Check if token already exists in the database with the same address, symbol, or name
    const existingToken = await Token.findOne({ $or: [{ address }, { symbol }, { name }] });

    if (existingToken) {
      return res.status(400).json({ error: 'Token with the same address, symbol, or name already exists.' });
    }

    // Create the token
    const token = new Token({
      address,
      uri,
      symbol,
      name,
      mintAuthority,
      freezeAuthority,
      decimals,
      supply,
      balance,
      type
    });

    // Save the token to the database
    await token.save();

    res.status(200).json({ message: 'Token created successfully.', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;