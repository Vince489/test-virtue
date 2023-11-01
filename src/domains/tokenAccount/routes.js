// Import required modules and models
const express = require("express");
const router = express.Router();
const TokenAccount = require("./model");
const Gamer = require("./../gamer/model");
const Account = require("./../account/model");

// Create a new TokenAccount
router.post("/", async (req, res, next) => {
  try {
    // Extract the required data from the request body
    const { mint, owner } = req.body;

    // Create a new TokenAccount instance
    const newTokenAccount = new TokenAccount({
      mint, // You should ensure that 'mint' is provided in the request body.
      owner, // You should ensure that 'owner' is provided in the request body.
      // You can set default values for 'balance', 'isFrozen', 'airdropReceived', and 'transactions' in the model.
    });

    // Save the new token account to the database
    await newTokenAccount.save();

    // Respond with a success message and the created token account
    res.status(201).json({ message: "Token account created successfully", tokenAccount: newTokenAccount });
  } catch (error) {
    // Handle any errors and pass them to the error handler middleware (next)
    next(error);
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
router.post("/addTokenAccount", async (req, res, next) => {
  try {
    // Extract data from the request body
    const { gamerId, tokenAccountId } = req.body;

    // Find the gamer by their ID
    const gamer = await Gamer.findById(gamerId).populate("account");

    if (!gamer) {
      return res.status(404).json({ message: "Gamer not found" });
    }

    console.log(gamer.account.tokenAccounts)


    // Add the token account to the gamer's account
   console.log(tokenAccountId);
    gamer.account.tokenAccounts.push(tokenAccountId);

    // Save the updated gamer
    await gamer.save();

    res.status(200).json({ message: "Token account added to gamer successfully", gamer });
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

module.exports = router;



