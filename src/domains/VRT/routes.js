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

    // Use .populate() to retrieve the associated VRT account
    const userAccount = await Account.findOne({ publicKey }).populate("vrtAccount").exec();

    if (!userAccount) {
      return res.status(404).json({ message: "User not found" });
    }

    // deduct the amount from the VRT balance
    const coinToAirdrop = await VRT.findOne({ symbol: "VRT" });
    if (!coinToAirdrop) {
      return res.status(404).json({ message: "VRT token not found" });
    }
    const amount = 100;
    if (coinToAirdrop.balance < amount) {
      return res.status(400).json({ message: "Insufficient VRT balance for airdrop" });
    }
    coinToAirdrop.balance -= amount;
    await coinToAirdrop.save();

    //increment the user's VRT balance
    userAccount.vrtAccount.balance += amount;
    await userAccount.vrtAccount.save();

    // Respond with the updated VRT account data
    res.status(200).json(userAccount.vrtAccount);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
