const express = require("express");
const router = express.Router();
const Stake = require("./model");
const Account = require("../account/model");
const Validator = require("../validator/model");
const Transaction = require("../transaction/model");
const Block = require("../block/model");
const crypto = require('crypto');
const nacl = require('tweetnacl');
const bs58 = require('bs58');


// get all stakes
router.get("/", async (req, res, next) => {
  try {
    const stakes = await Stake.find();
    res.json(stakes);
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const { stakerPublicKey, amount, lockupPeriod } = req.body;

    // Check if the amount is negative
    if (amount < 0) {
      return res.status(400).json({ message: 'Amount cannot be negative' });
    }

    // Find the staker's account using their publicKey
    const stakerAccount = await Account.findOne({ publicKey: stakerPublicKey });

    if (!stakerAccount) {
      return res.status(404).json({ message: 'Staker not found' });
    }

    // Check if the staker has enough VRT balance for the stake
    if (stakerAccount.vrtBalance < amount) {
      return res.status(400).json({ message: 'Insufficient VRT balance for the stake' });
    }

    // Deduct the staked amount from the staker's VRT balance
    stakerAccount.vrtBalance -= amount;

    // Create a new stake
    const newStake = new Stake({
      staker: stakerAccount._id,
      amount: amount,
      lockupPeriod: lockupPeriod, // You can specify the lockup period here
    });
    
    // Update staker vrtBalance
    await stakerAccount.save();

    // Save the stake to the database
    await newStake.save();

    // Create a new transaction for staking
    const stakingTransaction = new Transaction({
      sender: {
        id: stakerAccount._id,
        publicKey: stakerPublicKey,
        balance: stakerAccount.vrtBalance,
      },
      recipient: {
        id: newStake._id, // Recipient is the same as the staker in this case
        publicKey: stakerPublicKey,
        balance: newStake.amount, // Reflect the staked amount in the recipient's balance
      },
      amount: amount,
      // You can add more transaction-specific fields if needed
    });

    // Sign the staking transaction with the sender's private key
    const privateKey = bs58.decode(stakerAccount.privateKey);
    const transactionData = new TextEncoder().encode(stakingTransaction);

    const signature = nacl.sign.detached(transactionData, privateKey);

    // Store the signature in the staking transaction
    stakingTransaction.signature = bs58.encode(signature);

    // Save the staking transaction to the database
    await stakingTransaction.save();

    // Find the previous block to get its block height
    const previousBlock = await Block.findOne().sort({ blockHeight: -1 });

    // Calculate the new block height
    const newBlockHeight = previousBlock ? previousBlock.blockHeight + 1 : 0;

    // Create a new block for the staking transaction
    const newBlock = new Block({
      transactions: [stakingTransaction._id],
      blockHeight: newBlockHeight,
      // Set other block fields as needed
    });

    // Calculate the hash for the new block
    const blockData = JSON.stringify(newBlock);
    const blockHash = crypto.createHash('sha256').update(blockData).digest('hex');
    newBlock.hash = blockHash;

    // Save the block to the database
    await newBlock.save();

    // Respond with the updated VRT balance and the transaction ID
    res.status(200).json({
      message: 'Stake successful',
      vrtBalance: stakerAccount.vrtBalance,
      transactionId: stakingTransaction.id,
    });
  } catch (error) {
    next(error);
  }
});




  
  

  

module.exports = router;