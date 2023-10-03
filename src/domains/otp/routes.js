const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
} = require("./controller");
const Gamer = require("./../gamer/model");

// request new verification otp
router.post("/", async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body;

    const createdOTP = await sendOTP({
      email,
      subject,
      message,
      duration,
    });
    res.status(200).json(createdOTP);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/verify", async (req, res) => {
  try {
    let { email, otp } = req.body;

    const validOTP = await verifyOTP({ email, otp });
    res.status(200).json({ valid: validOTP });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Request a new OTP after expiration
router.post("/request-new-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is registered
    const existingGamer = await Gamer.findOne({ email });
    if (!existingGamer) {
      throw new Error("No account found for the provided email.");
    }

    // Generate a new OTP for the same email
    const newOTP = await sendOTP({
      email,
      subject: "New OTP",
      message: "Your new OTP is:",
      duration: 1, // Same duration as the original OTP
    });

    res.status(200).json({ message: "New OTP sent", newOTP });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;
