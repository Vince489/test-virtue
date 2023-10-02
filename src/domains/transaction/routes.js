const express = require('express');
const router = express.Router();
const VRTAccount = require('../vrtAccount/model');
const Transaction = require('../transaction/model');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const { getSenderPrivateKey } = require('./controller.js');


// POST endpoint for transferring funds between accounts
router.post('/transfer', async (req, res) => {
  try {
    // Extract the necessary information from the request body
    const { senderPublicKey, recipientPublicKey, amount, privateKey } = req.body;

    // Check if the amount is a whole number
    if (Math.round(amount) !== amount) {
      return res.status(400).json({ error: 'Amount must be a whole number.' });
    }

    if (senderPublicKey === recipientPublicKey) {
      return res.status(400).json({ error: 'Cannot transfer funds to your own account.' });
    }

    if (amount < 0) {
      return res.status(400).json({ error: 'Amount cannot be negative.' });
    }

    const fromAccount = await VRTAccount.findOne({ owner: senderPublicKey });
    const toAccount = await VRTAccount.findOne({ owner: recipientPublicKey });

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ error: 'VRTAccount not found.' });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds.' });
    }

    const transaction = new Transaction({
      sender: { publicKey: senderPublicKey },
      recipient: { publicKey: recipientPublicKey },
      amount: amount,
    });

    // Convert transaction data to a Uint8Array
    const transactionData = Buffer.from(JSON.stringify(transaction));

    // Convert the private key from base58 to bytes
    const privateKeyBytes = bs58.decode(privateKey);
    const privateKeyUint8 = new Uint8Array(privateKeyBytes);

    // Sign the transaction data using the private key
    const signature = nacl.sign.detached(transactionData, privateKeyUint8);

    // Convert the signature to a base58 encoded string
    const signatureString = bs58.encode(signature);

    // Attach the signature to the transaction object
    transaction.signature = signatureString;

    await transaction.save();

    fromAccount.transactions.push(transaction._id);
    fromAccount.balance -= Number(amount); // Subtract the transfer amount

    toAccount.transactions.push(transaction._id);
    toAccount.balance += Number(amount); // Add the transfer amount

    await fromAccount.save();
    await toAccount.save();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('sender', 'owner')
      .populate('recipient', 'owner')
      .exec();

    res.status(200).json({ message: 'Balance transfer successful.', transaction: populatedTransaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
