const express = require("express");
const router = express.Router();
const VRT = require("./model"); // Import the VRT model

// Create a new native coin entry in the database
router.post("/", async (req, res, next) => {
  try {
    // Extract data from the request body
    const { mint, icon, symbol, mintAuthority, freezeAuthority, supply, balance, decimals, frozen } = req.body;

    // Create a new VRT token object with the provided data
    const newVRT = new VRT({
      mint,
      icon,
      symbol,
      mintAuthority,
      freezeAuthority,
      supply,
      balance,
      decimals,
      frozen,
    });

    // Save the new VRT token to the database
    await newVRT.save();

    // Respond with the newly created VRT token data
    res.status(201).json(newVRT);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
