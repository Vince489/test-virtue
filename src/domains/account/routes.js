const express = require("express");
const router = express.Router();
const Mnemonic = require("./../../utils/seedPhrase");
const Keypair = require("./../../utils/keypair");
const TokenAccount = require("./../tokenAccount/model");
const Account = require("./model");
const SeedPhrase = require("./../seedPhrase/model");

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

// get vrt balance by public key
router.get('/getBalance/:publicKey/', async (req, res, next) => {
  try {
    const { publicKey } = req.params;

    // Find the user's account using their publicKey
    const userAccount = await Account.findOne({ publicKey });

    if (!userAccount) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve the user's VRT balance from their account
    const vrtBalance = userAccount.vrtBalance;

    res.status(200).json({ vrtBalance });
  } catch (error) {
    next(error);
  }
});

// get account by seed phrase array from request body
router.post("/getAccount", async (req, res, next) => {
  try {
    const { seedPhrase } = req.body;

    // Find the seed phrase document using the seed phrase array
    const seedPhraseDocument = await SeedPhrase.findOne({ seedPhrase });

    if (!seedPhraseDocument) {
      return res.status(404).json({ message: "Seed phrase not found" });
    }

    // Find the account associated with the seed phrase document
    const account = await Account.findOne({ seedPhrase: seedPhraseDocument._id });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Respond with the account data
    res.status(200).json({
      publicKey: account.publicKey,
      privateKey: account.privateKey,
    });
  } catch (error) {
    next(error);
  }
});


  







module.exports = router;
