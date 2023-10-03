const Gamer = require("./../gamer/model");

const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/controller");

const sendVerificationOTPEmail = async (email) => {
  try {
    // check if an account exists
    const existingGamer = await Gamer.findOne({ email });
    if (!existingGamer) {
      throw Error("There's no account for the provided email.");
    }

    const otpDetails = {
      email,
      subject: "Email Verification",
      message: "Verify your email with the code below.",
      duration: 1,
    };
    const createdOTP = await sendOTP(otpDetails);
    return createdOTP;
  } catch (error) {
    throw error;
  }
};

const verifyGamerEmail = async ({ email, otp }) => {
  try {
    const validOTP = await verifyOTP({ email, otp });
    if (!validOTP) {
      throw Error("Invalid code passed. Check your inbox.");
    }

    // now update Gamer record to show verified.
    await Gamer.updateOne({ email }, { verified: true });
    await deleteOTP(email);

    return;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendVerificationOTPEmail,
  verifyGamerEmail,
};
