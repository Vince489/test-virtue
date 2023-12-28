// Import required modules and models
const express = require("express");
const router = express.Router();
const TokenAccount = require("./model");
const Gamer = require("./../gamer/model");
const Account = require("./../account/model");
const Transaction = require("./../transaction/model");
const Block = require("./../block/model");
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const crypto = require('crypto');
const Keypair = require('./../../utils/keypair');
const Token = require("./../token/model");


// Create a new TokenAccount
router.post("/", async (req, res) => {
  try {
    const { ownerId, tokenId } = req.body;

    // Check if the owner (Gamer) and token exist
    const owner = await Gamer.findById(ownerId);
    const token = await Token.findById(tokenId);

    if (!owner || !token) {
      return res.status(404).json({ message: "Owner or Token not found" });
    }

    // Create a new TokenAccount
    const newTokenAccount = new TokenAccount({
      owner: ownerId,
      token: tokenId,
      publicKey: Keypair.generate().publicKey
    });

    // Save the new TokenAccount
    await newTokenAccount.save();

    // Respond with success message
    res.status(201).json({
      message: "TokenAccount created successfully",
      tokenAccountId: newTokenAccount.id,
    });
  } catch (error) {
    console.error("Error creating TokenAccount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define the POST endpoint for associating a TokenAccount with an Account
router.post('/associate-token-account', async (req, res) => {
  try {
    const { accountId, tokenAccountId } = req.body;

    // Find the Account based on accountId
    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Check if the tokenAccountId is already in the tokenAccounts array
    if (account.tokenAccounts.includes(tokenAccountId)) {
      return res.status(400).json({ message: 'TokenAccount is already associated with the Account' });
    }

    // Extract the mint value from the tokenAccountId
    const mint = tokenAccountId.mint; // Adjust this based on your data structure

    // Check if a token account with the same mint already exists in the tokenAccounts array
    const existingTokenAccount = account.tokenAccounts.find(tokenAcct => tokenAcct.mint === mint);

    if (existingTokenAccount) {
      return res.status(400).json({ message: 'A TokenAccount with the same mint already exists in the Account' });
    }

    // Push the ObjectId of the TokenAccount to the tokenAccounts array
    account.tokenAccounts.push(tokenAccountId);

    // Save the updated Account
    await account.save();

    return res.status(200).json({ message: 'TokenAccount associated with the Account successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



// Define the route for adding a TokenAccount to a Gamer
router.post('/add-token-account', async (req, res, next) => {
  try {
    // Extract the required data from the request body
    const { gamerTag, mint } = req.body;

    // Find the gamer based on their gamerTag
    const gamer = await Gamer.findOne({ gamerTag: gamerTag }).populate('account');

    if (!gamer) {
      return res.status(404).json({ message: 'Gamer not found' });
    }

    // Create a new TokenAccount with the provided mint and owner (gamer's account)
    const newTokenAccount = new TokenAccount({
      mint,
      owner: gamer.account, // Link the TokenAccount to the gamer's account
    });

    console.log("Hey:", newTokenAccount._id);

    // Save the new TokenAccount to the database
    await newTokenAccount.save();

    // Add the created TokenAccount to the gamer's account
    const g = gamer.account.tokenAccounts
    console.log(g);

    // Save the updated gamer's account

    res.status(201).json({ message: 'TokenAccount added to Gamer successfully', tokenAccount: newTokenAccount });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(error);
  }
});

// Add a token account to a gamer
// router.post("/addTokenAccount", async (req, res, next) => {
//   try {
//     // Extract data from the request body
//     const { gamerId, tokenAccountId } = req.body;

//     // Find the gamer by their ID
//     const gamer = await Gamer.findById(gamerId).populate("account");

//     if (!gamer) {
//       return res.status(404).json({ message: "Gamer not found" });
//     }

//     // console.log(gamer.account.tokenAccounts)


//     // Add the token account to the gamer's account
//     gamer.account.tokenAccounts.push(tokenAccountId);

//     // Save the updated gamer
//     await gamer.save();

//     res.status(200).json({ message: "Token account added to gamer successfully", gamer });
//   } catch (error) {
//     next(error);
//   }
// });

// Transfer tokens using Account public keys
router.post("/transfer", async (req, res, next) => {
  try {
    // Extract data from the request body
    const { fromPublicKey, toPublicKey, amount, symbol } = req.body;
    // Remove extra spaces and leading/trailing whitespace from 'from' and 'to' values
    // const cleanedFrom = fromPublicKey.trim();
    // const cleanedTo = toPublicKey.trim();
    // Find the token accounts by their public keys
    const gamerAccount = await Account.findOne({ publicKey: fromPublicKey });
    const tokenAccount = await TokenAccount.findOne({ owner: gamerAccount._id });
    if (!gamerAccount || !tokenAccount) {
      return res.status(404).json({ message: "Token account not found" });
    }
    // find token account by symbol
    const tokenAccount2 = await TokenAccount.findOne({ symbol: symbol });
    if (!tokenAccount2) {
      return res.status(404).json({ message: "Token account not found" });
    }
    // Ensure that the sender has enough tokens to send
    if (tokenAccount2.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    } 
    // Update the balances of the token accounts
    tokenAccount.balance -= amount;
    tokenAccount2.balance += amount;
    // Save the updated token accounts
    await tokenAccount.save();
    await tokenAccount2.save();
    res.status(200).json({ message: "Tokens transferred successfully" });
  } catch (error) {
    next(error);
  }




});


// Transfer tokens from one token account to another
router.post("/transfer2", async (req, res, next) => {
  try {
    // Extract data from the request body
    const { from, to, amount } = req.body;

    // Remove extra spaces and leading/trailing whitespace from 'from' and 'to' values
    const cleanedFrom = from.trim();
    const cleanedTo = to.trim();

    // Find the token accounts by their IDs
    const fromAccount = await TokenAccount.findById(cleanedFrom);
    const toAccount = await TokenAccount.findById(cleanedTo);

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ message: "Token account not found" });
    }

    // Ensure that the sender has enough tokens to send
    if (fromAccount.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update the balances of the token accounts
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    // Save the updated token accounts
    await fromAccount.save();
    await toAccount.save();

    res.status(200).json({ message: "Tokens transferred successfully" });
  } catch (error) {
    next(error);
  }
});

// get token account balance by public key and mint
router.get("/balance/:publicKey/:mint", async (req, res, next) => {
  try {
    // Extract the public key and mint from the request parameters
    const { publicKey, mint } = req.params;

    // Find the account by public key
    const account = await Account.findOne({ publicKey: publicKey }).exec();

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Find the token account by account and mint
    const tokenAccount = await TokenAccount.findOne({ owner: account._id, mint: mint }).exec();

    if (!tokenAccount) {
      return res.status(404).json({ message: "Token account not found" });
    }

    // Respond with the token account balance
    res.status(200).json({ balance: tokenAccount.balance });
  } catch (error) {
    next(error);
  }
});

router.post("/addTokenAccount2", async (req, res, next) => {
  try {
    // Extract data from the request body
    const { gamerId, tokenAccountId } = req.body;

    // Find the gamer by their ID and populate the 'account' field
    const gamer = await Gamer.findById(gamerId).populate("account");

    if (!gamer) {
      return res.status(404).json({ message: "Gamer not found" });
    }

    // Ensure that 'account' and 'tokenAccounts' are defined
    if (!gamer.account) {
      gamer.account = {};
    }
    if (!gamer.account.tokenAccounts) {
      gamer.account.tokenAccounts = [];
    }

    // Add the token account to the gamer's account
    gamer.account.tokenAccounts.push(tokenAccountId);

    // Save the updated gamer
    await gamer.save();

    res.status(200).json({ message: "Token account added to gamer successfully", gamer });
  } catch (error) {
    next(error);
  }
});

// Get all token accounts
router.get("/", async (req, res, next) => {
  try {
    // Find all token accounts
    const tokenAccounts = await TokenAccount.find();

    // Respond with the token accounts
    res.status(200).json({ tokenAccounts });
  } catch (error) {
    next(error);
  }
});

// Get all token accounts for a gamer
router.get("/gamer/:gamerId", async (req, res, next) => {
  try {
    // Extract the gamer ID from the request parameters
    const { gamerId } = req.params;

    // Find the gamer by ID
    const gamer = await Gamer.findById(gamerId);

    if (!gamer) {
      return res.status(404).json({ message: "Gamer not found" });
    }

    // Find all token accounts for the gamer
    const tokenAccounts = await TokenAccount.find({ owner: gamer.account });

    // Respond with the token accounts
    res.status(200).json({ tokenAccounts });
  } catch (error) {
    next(error);
  }
});

// Transfer tokens between two token accounts with the same mint using public keys
router.post("/transfer-between-accounts", async (req, res, next) => {
  try {
    // Extract data from the request body
    const { senderPublicKey, recipientPublicKey, mint, amount } = req.body;

    // Find the sender's account based on their public key
    const fromAccount = await Account.findOne({ publicKey: senderPublicKey }).exec();

    if (!fromAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    // Find the recipient's account based on their public key
    const toAccount = await Account.findOne({ publicKey: recipientPublicKey }).exec();

    if (!toAccount) {
      return res.status(404).json({ message: "Recipient account not found" });
    }

    // Find the sender's token account based on their account and mint
    const fromTokenAccount = await TokenAccount.findOne({ owner: fromAccount._id, mint }).exec();

    if (!fromTokenAccount) {
      return res.status(404).json({ message: "Sender token account not found" });
    }

    // Find the recipient's token account based on their account and mint
    let toTokenAccount = await TokenAccount.findOne({ owner: toAccount._id, mint }).exec();

    if (!toTokenAccount) {
      // If the recipient account doesn't exist, create a new one with the same mint
      toTokenAccount = new TokenAccount({
        owner: toAccount._id,
        mint,
        balance: 0, // Initialize the balance to 0
        // Other default values
      });

      await toTokenAccount.save();
    }

    // Add the newly created token account's ObjectId to the recipient's account's tokenAccounts array
    toAccount.tokenAccounts.push(toTokenAccount._id);
    await toAccount.save(); 

    // Ensure that the sender has enough tokens to send
    if (fromTokenAccount.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance for transfer" });
    }

    // Update the balances of the token accounts
    fromTokenAccount.balance -= amount;
    toTokenAccount.balance += amount;
    const g = fromTokenAccount.balance;
    console.log(g);
    // Save the updated token accounts
    await fromTokenAccount.save();
    await toTokenAccount.save();

    // Create a new transaction
    const newTransaction = new Transaction({
      sender: {
        id: fromAccount._id,
        publicKey: senderPublicKey,
        balance: fromTokenAccount.balance,
      },
      recipient: {
        id: toAccount._id,
        publicKey: recipientPublicKey,
        balance: toTokenAccount.balance,
      },
      amount: amount,
    });

    // Sign the transaction with the sender's private key
    const privateKey = bs58.decode(fromAccount.privateKey);
    const transactionData = new TextEncoder().encode(newTransaction);

    const signature = nacl.sign.detached(transactionData, privateKey);

    // Store the signature in the transaction
    newTransaction.signature = bs58.encode(signature);

    // Save the transaction to the database
    await newTransaction.save();

    // Find the previous block to get its block height
    const previousBlock = await Block.findOne().sort({ blockHeight: -1 }).exec();

    // Calculate the new block height
    const newBlockHeight = previousBlock ? previousBlock.blockHeight + 1 : 0;

    // Create a new block for each transaction with the incremented block height
    const newBlock = new Block({
      transactions: [newTransaction._id],
      blockHeight: newBlockHeight,
      previousBlockHash: previousBlock ? previousBlock.hash : "GENESIS",
    });

    //calculate the hash of the new block
    const blockData = new TextEncoder().encode(newBlock);
    const blockHash = crypto.createHash('sha256').update(blockData).digest('hex');
    newBlock.hash = blockHash;

    // Save the new block to the database
    await newBlock.save();

    // Push the transaction ID to the sender's account's transactions array
    fromAccount.transactions.push(newTransaction._id);
    await fromAccount.save();

    // Push the transaction ID to the recipient's account's transactions array
    toAccount.transactions.push(newTransaction._id);
    await toAccount.save();

    

    res.status(200).json({ message: "Tokens transferred successfully" });
  } catch (error) {
    console.error('Error while transferring tokens between token accounts:', error);
    next(error);
  }
});

// Get token account of a gamer by mint
router.get("/gamer/:gamerTag/:mint", async (req, res, next) => {
  try {
    // Extract the gamerTag and mint from the request parameters
    const { gamerTag, mint } = req.params;

    // Find the gamer by gamerTag
    const gamer = await Gamer.findOne({ gamerTag: gamerTag }).exec();

    if (!gamer) {
      return res.status(404).json({ message: `No gamer found with gamerTag: ${gamerTag}` });
    }

    // Ensure the gamer has an associated account
    if (!gamer.account) {
      return res.status(404).json({ message: "Gamer does not have an associated account" });
    }

    // Find the token account for the gamer based on the mint
    const tokenAccount = await TokenAccount.findOne({ owner: gamer.account, mint: mint }).exec();

    if (!tokenAccount) {
      return res.status(404).json({ message: `No token account found with mint: ${mint}` });
    }

    // Respond with the token account
    res.status(200).json({ tokenAccount });
  } catch (error) {
    console.error('Error while searching for a gamer:', error);
    next(error);
  }
});





module.exports = router;



