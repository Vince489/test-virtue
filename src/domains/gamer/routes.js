const express = require("express");
const router = express.Router();
const { createNewGamer, authenticateGamer } = require("./controller");
const auth = require("./../../middleware/auth");
const { sendVerificationOTPEmail } = require("./../email_verification/controller");
const createJWT = require("../../utils/createJWT");
const Gamer = require("./model");
const { verifyToken, checkDashboardAccess } = require('../../middleware/auth');
const Account = require("./../account/model");


// Endpoint to add a new gamer
router.post('/add-gamer', async (req, res) => {
  try {
    const { gamerTag, email, password } = req.body;

    // Create a new gamer instance
    const newGamer = new Gamer({ gamerTag, email, password });

    // Save the new gamer to the database
    const savedGamer = await newGamer.save();

    res.json(savedGamer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add a new gamer.' });
  }
});


// Sign-up route
router.post("/signup", async (req, res) => {
  try {
    let { gamerTag, email, password } = req.body;
    gamerTag = gamerTag.trim();
    email = email.trim();
    password = password.trim();

    if (!(gamerTag && email && password)) {
      throw Error("Empty input fields!");
    } else if (!/^[a-zA-Z0-9 ]*$/.test(gamerTag)) {
      throw Error("Invalid gamerTag entered");
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw Error("Invalid email entered");
    } else if (password.length < 8) {
      throw Error("Password is too short!");
    } else {

      await createNewGamer({
        gamerTag,
        email, 
        password,
      });

      await sendVerificationOTPEmail(email);

      res.status(201).json('Gamer created successfully! Please verify your email address.');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Sign in
router.post("/", async (req, res) => {
  try {
    const { gamerTag, password } = req.body;

    const trimmedGamerTag = gamerTag.trim();
    const trimmedPassword = password.trim();

    // Check if gamer tag and password are empty
    if (!trimmedGamerTag || !trimmedPassword) {
      throw Error("Empty credentials supplied!"); 
    }

    const authenticatedGamer = await authenticateGamer({ gamerTag, password });

    const gamer = { gamer: authenticatedGamer };

    // Create a JWT token
    const token = await createJWT(gamer);

    // Set the token as a cookie
    res.cookie("token", token, { 
      httpOnly: true,
      sameSite: "None",
      secure: true,
      expires: new Date(Date.now() + 48 * 60 * 60 * 1000), // set expires to 48 hours from now
      path: '/'
    });

    res.status(200).json({
      authenticatedGamer: authenticatedGamer,
      token: token
    });
    } catch (error) {
      // Log the error for debugging
      console.error(error);
    // Send a generic error message to the client
    res.status(400).json({ message: "Authentication failed" });
  }
});

// Get all gamers
router.get("/", async (req, res) => {
  try {
    const gamers = await Gamer.find({}, { password: 0 }); // exclude password field
    res.json(gamers);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// search db by gamerTag
router.get('/:gamerTag', async (req, res) => {
  try {
    const gamerTag = req.params.gamerTag;

    // Retrieve the gamer with the specified gamerTag
    const gamers = await Gamer.find({ gamerTag });

    // Return the list of gamers as a JSON object
    res.json(gamers);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
});

// Logout route 
router.post('/logout', (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.TOKEN_KEY === 'production' // Set secure flag based on environment
    });

    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during logout.' });
  }
});

// Add account to gamer
router.post("/add-account", async (req, res, next) => {
  try {
    const { gamerTag, accountId } = req.body;
    console.log(req.body);

    // Find the gamer's account based on their gamerTag
    const gamer = await Gamer.findOne({ gamerTag: gamerTag });

    if (!gamer) {
      return res.status(404).json({ message: 'Gamer account not found' });
    }

    // Check if the account with the provided accountId exists
    const existingAccount = await Account.findById(accountId);

    if (!existingAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }


 
    // Associate the existing account with the gamer's account
    gamer.account = existingAccount._id;

    // Save the updated gamer's account
    await gamer.save();

    res.status(200).json({ message: 'Account associated with gamer successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(error);
  }
});

// Go to dashboard
router.get("/dashboard", verifyToken, checkDashboardAccess, async (req, res) => {
  try {
    const gamer = await Gamer.findById(req.gamer.gamerId);
    res.status(200).json({ gamer }).populate('account');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});









module.exports = router;
