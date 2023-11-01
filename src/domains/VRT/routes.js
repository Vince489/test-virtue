const express = require("express");
const router = express.Router();
const VRT = require("./model"); // Import the VRT model
const Account = require("../account/model"); // Import the Account model
const Transaction = require("../transaction/model"); // Import the Transaction model

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
    const { publicKey, amount } = req.body;

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
    if (coinToAirdrop.availableSupply < amount) {
      return res.status(400).json({ message: "Insufficient VRT balance for airdrop" });
    }

    // Deduct the airdrop amount from the VRT balance
    coinToAirdrop.availableSupply -= amount;
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

router.post("/airdrop2", async (req, res, next) => {
  try {
    const { publicKey, amount } = req.body;

    // Set the default sender's public key
    const senderPublicKey = "Airdrop7LAuFgEy9YCDb1dSjNfo5FwvhmbzBU81KYwU8";

    // Set the default sender's id
    const senderId = "5f8b8b7b4d3b3b1b1b1b1b1b";

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

    // Deduct the airdrop amount from the VRT balance of the sender
    if (coinToAirdrop.balance < amount) {
      return res.status(400).json({ message: "Insufficient VRT balance for airdrop" });
    }

    // Deduct the airdrop amount from the VRT balance of the sender
    coinToAirdrop.balance -= amount;
    await coinToAirdrop.save();

    // Increment the user's VRT balance within their account
    userAccount.vrtBalance += amount;
    await userAccount.save();

    // Create a new airdrop transaction
    const airdropTransaction = new Transaction({
      sender: {
        id: senderId,
        publicKey: senderPublicKey,
      },
      recipient: {
        id: userAccount._id,
        publicKey: publicKey,
        balance: userAccount.vrtBalance,
      },
      amount,
      balance: userAccount.vrtBalance, // Set the balance field in the transaction
    });

    // Save the airdrop transaction to the database
    await airdropTransaction.save();

    // Push the transaction ID to the user's transaction array
    userAccount.transactions.push(airdropTransaction._id);

    // Save the updated user account to the database
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
