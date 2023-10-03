const express = require("express");
const router = express.Router();
const { createNewGamer, authenticateGamer } = require("./controller");
const auth = require("./../../middleware/auth");
const { sendVerificationOTPEmail } = require("./../email_verification/controller");
const createJWT = require("../../utils/createJWT");
const Gamer = require("./model");
const verifyToken = require('../../middleware/auth');


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
      expires: new Date(Date.now() + 3600000),
      path: '/'
    });

    res.status(200).json({
      authenticatedGamer: authenticatedGamer,
      token: token
    });
    } catch (error) {
      // Log the error for debugging
    console.error("Authentication error:", error);

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

// new auth route
router.get('/authenticate2', verifyToken, async (req, res) => {
  try {
    // Access the authenticated user's data from the req.user object
    const userData = req.user;

    // Find the gamer in the database using the gamer's unique identifier
    const gamer = await Gamer.findOne({ gamerTag: userData.gamerTag });

    if (!gamer) {
      return res.status(404).json({ error: 'Gamer not found' });
    }

    // You can customize the gamer data that you want to send to the frontend
    const gamerDataForFrontend = {
      gamerTag: gamer.gamerTag,
      email: gamer.email,
      // Add other properties as needed
    };

    res.status(200).json(gamerDataForFrontend);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during authentication.' });
  }
});

// Authenticate route
router.get('/authenticate', auth, async (req, res) => {
  try {
    // access the authenticated gamer via req.user
    const gamer = req.user;

    res.status(200).json(gamer);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during authentication.' });
  }
});

// say hello to the user
router.get('/hello', auth, (req, res) => {
  try {
    res.status(200).json({ message: 'Hello, gamer Boy!' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during authentication.' });
  }
});

router.get("/dashboard", auth, async (req, res) => {
  try {
    // access the authenticated gamer via req.user
    const gamer = req.user;
    console.log(gamer);

    res.status(200).json(gamer);
  } catch (error) {
    res.status(500).json({ error: "An error occurred during authentication." });
  }
})

// protected route
router.get("/protected", auth, (req, res) => {
  try {
    res.status(200).json({ message: "You are authorized to access this route." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during authentication." });
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









module.exports = router;
