const express = require("express");
const router = express.Router();
const Mnemonic = require("./../../utils/seedPhrase");
const Keypair = require("./../../utils/keypair");
const TokenAccount = require("./../tokenAccount/model");
const Account = require("./model");
const SeedPhrase = require("./../seedPhrase/model");
const VRTAccount = require("./../vrtAccount/model");

// get all accounts
router.get("/", async (req, res, next) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    next(error);
  }
});

// Create a new account with an associated token account
router.post("/", async (req, res, next) => {
  try {
    // Generate a new key pair and seed phrase
    const keypair = Keypair.generate();
    const seedPhrase = Mnemonic.generate();

    // Create a new seed phrase document
    const newSeedPhrase = new SeedPhrase({
      seedPhrase: seedPhrase.seedPhrase,
    }); 

    // Save the new seed phrase to the database
    await newSeedPhrase.save();

    // Create a new account associated with the seed phrase
    const newAccount = new Account({
      seedPhrase: newSeedPhrase._id, // Reference the saved seed phrase document
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
    });

    // Generate a new public key for the token account
    const tokenAccountPublicKey = Keypair.generate().publicKey;

    // Create a new TokenAccount associated with the VRT mint
    const newNativeAccount = new VRTAccount({
      owner: newAccount.publicKey, // Reference the saved account document
      balance: 0, // Set the initial balance to zero
      transactions: [],
    });

    // Save the new token account to the database
    await newNativeAccount.save();

    // Set the vrtAccount field of the new account to the ID of the new token account
    newAccount.vrtAccount = newNativeAccount._id;

    // Save the new account to the database
    await newAccount.save();

    // Retrieve the seed phrase document from the database using its ID
    const retrievedSeedPhrase = await SeedPhrase.findById(newSeedPhrase._id);

    // Respond with the newly created account data and the seed phrase
    res.status(201).json({
      account: newAccount,
      seedPhrase: retrievedSeedPhrase.seedPhrase,
    });
  } catch (error) {
    next(error);
  }
});

// get account by public key
router.get('/:publicKey', async (req, res, next) => {
  try {
    const { publicKey } = req.params;

    // Use .populate() to retrieve the associated VRT account
    const userAccount = await Account.findOne({ publicKey }).populate('vrtAccount').exec();
    console.log(userAccount);

    if (!userAccount) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      publicKey: userAccount.publicKey,
      vrtAccount: userAccount.vrtAccount, // Assuming vrtAccount is the populated field
      // ...other user account properties
    });
  } catch (error) {
    next(error);
  }
});

// get vrt balance by public key
router.get('/:publicKey/vrt-balance', async (req, res, next) => {
  try {
    const { publicKey } = req.params;

    // Use .populate() to retrieve the associated VRT account
    const userAccount = await Account.findOne({ publicKey }).populate('vrtAccount').exec();

    if (!userAccount) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      publicKey: userAccount.publicKey,
      Balance: userAccount.vrtAccount.balance, // Assuming vrtAccount is the populated field
    });
  } catch (error) {
    next(error);
  }
});

// Transfer tokens from one token account to another
router.post("/transfer", async (req, res) => {
  try {
    const { senderPublicKey, recipientPublicKey, amount } = req.body; // Extract the sender's public key, recipient's public key, and amount from the request body

    // Check if the sender's token account exists
    const senderAccount = await TokenAccount.findOne({
      owner: senderPublicKey,
    });

    if (!senderAccount) {
      return res.status(404).json({ error: "Sender token account not found." });
    }

    // Check if the recipient's token account exists
    const recipientAccount = await TokenAccount.findOne({
      owner: recipientPublicKey,
    });

    if (!recipientAccount) {
      return res
        .status(404)
        .json({ error: "Recipient token account not found." });
    }

    // Check if the sender has sufficient token balance
    if (senderAccount.balance < amount) {
      return res
        .status(400)
        .json({ error: "Insufficient token balance for transfer." });
    }

    // Decrement the sender's token account balance
    senderAccount.balance -= amount;
    await senderAccount.save();

    // Increment the recipient's token account balance
    recipientAccount.balance += amount;
    await recipientAccount.save();

    res.status(200).json({ message: "Transfer successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
