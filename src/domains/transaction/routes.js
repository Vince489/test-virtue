const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Account = require('../account/model');
const Block = require('../block/model');
const Blockchain = require('../blockchain/model');
const PendingTransaction = require('../pendingTransactions/model');
const VRT = require('../VRT/model');
const Transaction = require('./model');
const pendingTransactions = require('../pendingTransactions/model');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const transferFee = 0.00125;


// Get all transactions
router.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.find().select("sender recipient amount");
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// Transfer VRT from one account to another
router.post("/transfer", async (req, res, next) => {
  try {
    const { senderPublicKey, recipientPublicKey, amount } = req.body;

    // Check if the amount is negative
    if (amount < 0) {
      return res.status(400).json({ message: "Please enter a valid amount." });
    }

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

    // Check if the sender has enough VRT balance for the transfer
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
        balance: senderAccount.vrtBalance, 
      },
      recipient: {
        id: recipientAccount._id,
        publicKey: recipientPublicKey,
        balance: recipientAccount.vrtBalance,
      },
      amount: amount,
    });

    // Sign the transaction with the sender's private key
    const privateKey = bs58.decode(senderAccount.privateKey);
    const transactionData = new TextEncoder().encode(newTransaction);

    const signature = nacl.sign.detached(transactionData, privateKey);

    // Store the signature in the transaction
    newTransaction.signature = bs58.encode(signature);

    // Save the transaction to the database
    await newTransaction.save();

    // Find the previous block to get its block height
    const previousBlock = await Block.findOne().sort({ blockHeight: -1 });

    // Calculate the new block height
    const newBlockHeight = previousBlock ? previousBlock.blockHeight + 1 : 0;

    // Create a new block for each transaction with the incremented block height
    const newBlock = new Block({
      transactions: [newTransaction._id],
      blockHeight: newBlockHeight,
      previousHash: previousBlock ? previousBlock.hash : "GENESIS", // Set previousHash
    });

    // Calculate the hash for the new block
    const blockData = JSON.stringify(newBlock); // Convert block data to a string
    const blockHash = crypto.createHash('sha256').update(blockData).digest('hex');
    newBlock.hash = blockHash; // Set the hash

    // Save the block to the database
    await newBlock.save();

    // Get or create the blockchain based on its name
    let blockchain = await Blockchain.findOne({ name: 'YourBlockchainName' });

    if (!blockchain) {
      return res.status(404).json({ message: "Blockchain not found" });
    }

    // Push the transaction to the blockchain's pending transactions
    blockchain.pendingTransactions.push(newTransaction._id);
    
    // Save the updated blockchain with the new transaction
    await blockchain.save();

    // Push the transaction ID to the sender's and recipient's transaction arrays
    senderAccount.transactions.push(newTransaction._id);
    recipientAccount.transactions.push(newTransaction._id);

    // Save the sender and recipient accounts again to update their transaction arrays
    await senderAccount.save();
    await recipientAccount.save();

    // Respond with the updated VRT balance
    res.status(200).json({ 
      message: "Transfer successful", 
      vrtBalance: senderAccount.vrtBalance,
      transactionId: newTransaction.id,
    });
  } catch (error) {
    next(error);
  }
});

//22
router.post("/transfer2", async (req, res, next) => {
  try {
    const { senderPublicKey, recipientPublicKey, amount } = req.body;

    // Check if the amount is negative
    if (amount < 0) {
      return res.status(400).json({ message: "Amount cannot be negative" });
    }

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

    // Check if the sender has enough VRT balance for the transfer
    if (senderAccount.vrtBalance < amount + transferFee) {
      return res.status(400).json({ message: "Insufficient VRT balance for transfer" });
    }

    // Create a new transaction
    const newTransaction = new Transaction({
      sender: {
        id: senderAccount._id,
        publicKey: senderPublicKey,
        balance: senderAccount.vrtBalance,
      },
      recipient: {
        id: recipientAccount._id,
        publicKey: recipientPublicKey,
        balance: recipientAccount.vrtBalance,
      },
      amount: amount,
    });

    // Sign the transaction with the sender's private key
    const privateKey = bs58.decode(senderAccount.privateKey);
    const transactionData = new TextEncoder().encode(JSON.stringify(newTransaction));

    const signature = nacl.sign.detached(transactionData, privateKey);

    // Store the signature in the transaction
    newTransaction.signature = bs58.encode(signature);

    // Add the new transaction to the blockchain's pending transactions array
    const blockchain = await Blockchain.findOne(); // Find the blockchain
    blockchain.pendingTransactions.push(newTransaction._id);

    // Save the transaction and update the blockchain's pending transactions
    await newTransaction.save();
    await blockchain.save();

    // Respond with a success message
    res.status(200).json({
      message: "Transaction created and added to pending transactions",
      transactionId: newTransaction.id,
    });
  } catch (error) {
    next(error);
  }
});

// Get a transaction by ID
router.get("/:id", async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    res.json(transaction);
  } catch (error) {
    next(error);
  }
});










module.exports = router;
