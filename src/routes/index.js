const express = require("express");
const router = express.Router();


const accountRoutes = require("./../domains/account");
const tokenAccountRoutes = require("./../domains/tokenAccount");
const VRTTokenRoutes = require("./../domains/VRT");
const gamerRoutes = require("./../domains/gamer");
const seedPhraseRoutes = require("./../domains/seedPhrase");
const blockRoutes = require("./../domains/block");
const transactionRoutes = require("./../domains/transaction");
const OTPRoutes = require("./../domains/otp");
const EmailVerificationRoutes = require("./../domains/email_verification");
const ForgotPasswordRoutes = require("./../domains/forgot_password");
const AccountRoutes = require("./../domains/account");
const TokenRoutes = require("./../domains/token");
const VRTRoutes = require("./../domains/VRT");
const BlockRoutes = require("./../domains/block");

router.use("/account", accountRoutes);
router.use("/tokenAccount", tokenAccountRoutes);
router.use("/VRT", VRTTokenRoutes);
router.use("/gamer", gamerRoutes);
router.use("/seedPhrase", seedPhraseRoutes);
router.use("/block", blockRoutes);
router.use("/transaction", transactionRoutes);
router.use("/otp", OTPRoutes);
router.use("/email_verification", EmailVerificationRoutes);
router.use("/forgot_password", ForgotPasswordRoutes);
router.use("/account", AccountRoutes);
router.use("/token", TokenRoutes);
router.use("/VRT", VRTRoutes);
router.use("/block", BlockRoutes);

module.exports = router;