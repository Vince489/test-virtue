const express = require("express");
const router = express.Router();
const Mnemonic = require("./../../utils/seedPhrase");
const Keypair = require("./../../utils/keypair");
const TokenAccount = require("./../tokenAccount/model");
const Account = require("./model");
const VRT = require("./../VRT/model");
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

    // Save the new account to the database
    await newAccount.save();

    // Generate a new public key for the token account
    const tokenAccountPublicKey = Keypair.generate().publicKey;

    // Create a new TokenAccount associated with the VRT mint
    const newTokenAccount = new TokenAccount({
      mint: "VRT1111111111111111111111111111111111111111", // Replace with the actual VRT mint address
      address: tokenAccountPublicKey, // Use the generated public key as the token account's address
      owner: newAccount.publicKey,
      balance: 0,
      isFrozen: false,
      airdropReceived: false,
    });

    // Save the new token account to the database
    await newTokenAccount.save();

    // Add the token account to the new account's tokenAccounts array
    newAccount.tokenAccounts.push(newTokenAccount._id);

    // Save the updated account to the database
    await newAccount.save();

    // Respond with the newly created account data
    res.status(201).json(newAccount);
  } catch (error) {
    next(error);
  }
});

router.post('/airdrop', async (req, res) => {
  try {
    const { userPublicKey } = req.body; // Extract the user's public key from the request body

    // Check if the token account exists (using the user's public key)
    const recipientAccount = await TokenAccount.findOne({ owner: userPublicKey });

    if (!recipientAccount) {
      return res.status(404).json({ error: 'Token account not found.' });
    }

    // Check if the recipient has already received the airdrop
    if (recipientAccount.airdropReceived) {
      return res.status(400).json({ error: 'Airdrop already received.' });
    }

    // Decrement the token balance for airdrop
    const tokenToAirdrop = await VRT.findOne({ mint: 'VRT1111111111111111111111111111111111111111' });

    if (!tokenToAirdrop) {
      return res.status(404).json({ error: 'Token not found.' });
    }

    const amountToAirdrop = 100; // Define the amount to be airdropped

    if (tokenToAirdrop.balance < amountToAirdrop) {
      return res.status(400).json({ error: 'Insufficient token balance for airdrop.' });
    }

    tokenToAirdrop.balance -= amountToAirdrop;
    await tokenToAirdrop.save();

    // Increment the recipient's token account balance
    recipientAccount.balance += amountToAirdrop;
    recipientAccount.airdropReceived = true;
    await recipientAccount.save();

    res.status(200).json({ message: 'Airdrop successful.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
