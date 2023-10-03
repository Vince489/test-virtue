const Gamer = require("./../gamer/model");
const { hashData } = require("./../../utils/hashData");
const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/controller");

const sendPasswordResetOTPEmail = async (email) => {
  try {
    // check if an account exists
    const existingGamer = await Gamer.findOne({ email });
    if (!existingGamer) {
      throw Error("There's no account for the provided email.");
    }

    if (!existingGamer.verified) {
      throw Error("Email hasn't been verified yet. Check your inbox.");
    }

    const otpDetails = {
      email,
      subject: "Password Reset",
      message: "Enter the code below to reset your password.",
      duration: 1,
    };
    const createdOTP = await sendOTP(otpDetails);
    return createdOTP;
  } catch (error) {
    throw error;
  }
};

const resetGamerPassword = async ({ email, otp, newPassword }) => {
  try {
    const validOTP = await verifyOTP({ email, otp });
    if (!validOTP) {
      throw Error("Invalid code passed. Check your inbox.");
    }

    // now update gamer record with new password.
    if (newPassword.length < 8) {
      throw Error("Password is too short!");
    }
    const hashedNewPassword = await hashData(newPassword);
    await Gamer.updateOne({ email }, { password: hashedNewPassword });
    await deleteOTP(email);

    return;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendPasswordResetOTPEmail,
  resetGamerPassword,
};
