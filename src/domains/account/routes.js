require("dotenv").config();

const express = require("express");
const router = express.Router();
const Mnemonic = require("./../../utils/seedPhrase");
const Keypair = require("./../../utils/keypair");
const Account = require("./model");
const SeedPhrase = require("./../seedPhrase/model");
const Transaction = require("./../transaction/model");
const Validator = require("./../validator/model");
const Stake = require("./../stake/model");




// get all accounts
router.get("/", async (req, res, next) => {
  try {
    const accounts = await Account.find().select("publicKey tokenAccounts transactions vrtBalance");
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


router.post("/create-accounts", async (req, res, next) => {
  try {
    const numAccountsToCreate = 25;
    const createdAccounts = [];

    for (let i = 0; i < numAccountsToCreate; i++) {
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

      // Retrieve the seed phrase document from the database using its ID
      const retrievedSeedPhrase = await SeedPhrase.findById(newSeedPhrase._id);

      createdAccounts.push({
        account: newAccount,
        seedPhrase: retrievedSeedPhrase.seedPhrase,
      });
    }

    // Respond with the array of newly created accounts and associated seed phrases
    res.status(201).json(createdAccounts);
  } catch (error) {
    next(error);
  }
});

//22
router.post("/create-accounts2", async (req, res, next) => {
  try {
    const numAccountsToCreate = 25;
    const createdAccounts = [];

    for (let i = 0; i < numAccountsToCreate; i++) {
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

      // Create a new stake associated with the account
      const newStake = new Stake({
        staker: newAccount._id, // Reference the saved account document
        amount: 10,// Other stake-related fields go here
        address: Keypair.generate().publicKey,
      });

      // Save the new stake to the database
      await newStake.save();

      // Add the ObjectId of the new stake to the account's 'stake' array
      newAccount.stake.push(newStake._id);
      await newAccount.save(); // Save the updated account

      // Retrieve the seed phrase document from the database using its ID
      const retrievedSeedPhrase = await SeedPhrase.findById(newSeedPhrase._id);

      createdAccounts.push({
        account: newAccount,
        seedPhrase: retrievedSeedPhrase.seedPhrase,
        stake: newStake, // Include the associated stake in the response
      });
    }

    // Respond with the array of newly created accounts, associated seed phrases, and stakes
    res.status(201).json(createdAccounts);
  } catch (error) {
    next(error);
  }
});

router.post("/create-account", async (req, res, next) => {
  try {
    const numAccountsToCreate = 25;
    const createdAccounts = [];

    for (let i = 0; i < numAccountsToCreate; i++) {
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

      // Create a new stake associated with the account
      const newStake = new Stake({
        staker: newAccount._id, // Reference the saved account document
        amount: 10, // Other stake-related fields go here
        address: Keypair.generate().publicKey
      });

      // Save the new stake to the database
      await newStake.save();

      // Add the ObjectId of the new stake to the account's 'stake' array
      newAccount.stake.push(newStake._id);
      await newAccount.save(); // Save the updated account

      // Create a new validator and associate it with the account
      const newValidator = new Validator({
        stake: newAccount.stake._id, // Other validator-related fields go here
        address: Keypair.generate().publicKey,
        owner: newAccount._id
      });

      console.log(newValidator);

      // Save the new validator to the database
      await newValidator.save();

      // Retrieve the seed phrase document from the database using its ID
      const retrievedSeedPhrase = await SeedPhrase.findById(newSeedPhrase._id);

      createdAccounts.push({
        account: newAccount,
        seedPhrase: retrievedSeedPhrase.seedPhrase,
        stake: newStake, // Include the associated stake in the response
        validator: newValidator, // Include the associated validator in the response
      });
    }

    // Respond with the array of newly created accounts, associated seed phrases, stakes, and validators
    res.status(201).json(createdAccounts);
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
      amount: amount
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

// Convert vrt to vrtx
router.post("/convert", async (req, res, next) => {
  try {
    const { publicKey, amount } = req.body;

    // Find the user's account using their publicKey
    const userAccount = await Account.findOne({ publicKey });

    if (!userAccount) {
      return res.status(404).json({ message: "User not found" });
    }

    // Deduct the conversion amount from the user's VRT balance
    if (userAccount.vrtBalance < amount) {
      return res.status(400).json({ message: "Insufficient VRT balance for conversion" });
    }

    // Deduct the conversion amount from the user's VRT balance
    userAccount.vrtBalance -= amount;
    await userAccount.save();

    // Increment the user's VRTX balance
    userAccount.vrtxBalance += amount;
    await userAccount.save();

    // Create a new transaction
    const newTransaction = new Transaction({
      sender: {
        id: userAccount._id,
        publicKey: publicKey,
      },
      recipient: {
        id: userAccount._id,
        publicKey: publicKey,
      },
      amount: amount
    });

    // Save the transaction to the database
    await newTransaction.save();

    // Push the transaction ID to the user's transaction array
    userAccount.transactions.push(newTransaction._id);

    // Save the user account again to update their transaction array
    await userAccount.save();

    // Respond with the updated VRT balance
    res.status(200).json({ message: "Conversion successful", vrtBalance: userAccount.vrtBalance });
  } catch (error) {
    next(error);
  }
});


  







module.exports = router;
