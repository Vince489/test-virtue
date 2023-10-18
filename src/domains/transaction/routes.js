const express = require('express');
const router = express.Router();
const Account = require('../account/model');
const VRT = require('../VRT/model');
const Transaction = require('./model');
const nacl = require('tweetnacl');


// Get all transactions
router.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.find().select("sender recipient amount");
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});


// Transfer VRT token from one account to another
router.post("/transfer", async (req, res, next) => {
  try {
    const { senderPublicKey, recipientPublicKey, amount } = req.body;

    // Find the sender's account using their publicKey
    const senderAccount = await Account.findOne({ publicKey: senderPublicKey });

    if (!senderAccount) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Find the recipient's account using their publicKey
    const recipientAccount = await Account.findOne({ publicKey: recipientPublicKey });

    if (!recipientAccount) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Deduct the transfer amount from the sender's VRT balance
    if (senderAccount.vrtBalance < amount) {
      return res.status(400).json({ message: "Insufficient VRT balance for transfer" });
    }

    // Deduct the transfer amount from the sender's VRT balance
    senderAccount.vrtBalance -= amount;
    await senderAccount.save();

    // Increment the recipient's VRT balance
    recipientAccount.vrtBalance += amount;
    await recipientAccount.save();

    // Create a new transaction
    const newTransaction = new Transaction({
      sender: {
        id: senderAccount._id,
        publicKey: senderPublicKey,
      },
      recipient: {
        id: recipientAccount._id,
        publicKey: recipientPublicKey,
      },
      amount: amount,
      balance: senderAccount.vrtBalance, // Set the balance field in the transaction
    });

    // Save the transaction to the database
    await newTransaction.save();

    // Push the transaction ID to the sender's and recipient's transaction arrays
    senderAccount.transactions.push(newTransaction._id);
    recipientAccount.transactions.push(newTransaction._id);

    // Save the sender and recipient accounts again to update their transaction arrays
    await senderAccount.save();
    await recipientAccount.save();

    // Respond with the updated VRT balance
    res.status(200).json({ message: "Transfer successful", vrtBalance: senderAccount.vrtBalance });
  } catch (error) {
    next(error);
  }
});





module.exports = router;
