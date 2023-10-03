const express = require("express");
const router = express.Router();
const VRT = require("./model"); // Import the VRT model
const Account = require("../account/model"); // Import the Account model

// Create a new native coin entry in the database
router.post("/", async (req, res, next) => {
  try {
    // Extract data from the request body
    const { name, symbol, totalSupply, balance, icon, authority, frozen } = req.body;

    // Create a new VRT token object with the provided data
    const newVRT = new VRT({
      name,
      symbol,
      totalSupply,
      balance,
      icon,
      authority,
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

// AirDrop VRT token to an account
router.post("/airdrop", async (req, res, next) => {
  try {
    const { publicKey } = req.body;

    // Find the user's account using their publicKey
    const userAccount = await Account.findOne({ publicKey });

    if (!userAccount) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the current VRT balance from the database
    const coinToAirdrop = await VRT.findOne({ symbol: "VRT" });

    if (!coinToAirdrop) {
      return res.status(404).json({ message: "VRT token not found" });
    }

    // Deduct the airdrop amount from the VRT balance
    const amount = 100; 
    if (coinToAirdrop.balance < amount) {
      return res.status(400).json({ message: "Insufficient VRT balance for airdrop" });
    }

    // Deduct the airdrop amount from the VRT balance
    coinToAirdrop.balance -= amount;
    await coinToAirdrop.save();

    // Increment the user's VRT balance within their account
    userAccount.vrtBalance += amount;
    await userAccount.save();

    // Respond with the updated VRT balance
    res.status(200).json({ message: "Airdrop successful", vrtBalance: userAccount.vrtBalance });
  } catch (error) {
    next(error);
  }
});

// Get all VRT tokens
router.get("/", async (req, res, next) => {
  try {
    // Retrieve all VRT tokens from the database
    const allVRT = await VRT.find();

    // Respond with the retrieved VRT tokens
    res.status(200).json(allVRT);
  } catch (error) {
    next(error);
  }
});

// freeze VRT token
router.post("/freeze/:symbol", async (req, res, next) => {
  try {
    const { symbol } = req.params;

    // Retrieve the VRT token from the database
    const vrtToken = await VRT.findOne({ symbol });

    if (!vrtToken) {
      return res.status(404).json({ message: "VRT token not found" });
    }

    // Freeze the VRT token
    vrtToken.frozen = true;
    await vrtToken.save();

    // Respond with the updated VRT token
    res.status(200).json(vrtToken);
  } catch (error) {
    next(error);
  }
});

// unfreeze VRT token
router.post("/unfreeze/:symbol", async (req, res, next) => {
  try {
    const { symbol } = req.params;

    // Retrieve the VRT token from the database
    const vrtToken = await VRT.findOne({ symbol });

    if (!vrtToken) {
      return res.status(404).json({ message: "VRT token not found" });
    }

    // Freeze the VRT token
    vrtToken.frozen = false;
    await vrtToken.save();

    // Respond with the updated VRT token
    res.status(200).json(vrtToken);
  } catch (error) {
    next(error);
  }
});





module.exports = router;
