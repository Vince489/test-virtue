const express = require("express");
const router = express.Router();


const AccountRoutes = require("./../domains/account");
const TokenAccountRoutes = require("./../domains/tokenAccount");
const VRTTokenRoutes = require("./../domains/VRT");
const GamerRoutes = require("./../domains/gamer");
const SeedPhraseRoutes = require("./../domains/seedPhrase");
const BlockRoutes = require("./../domains/block");
const TransactionRoutes = require("./../domains/transaction");
const OTPRoutes = require("./../domains/otp");
const EmailVerificationRoutes = require("./../domains/email_verification");
const ForgotPasswordRoutes = require("./../domains/forgot_password");
const TokenRoutes = require("./../domains/token");
const VRTRoutes = require("./../domains/VRT");
const FighterRoutes = require("./../domains/fighter");

router.use("/account", AccountRoutes);
router.use("/tokenAccount", TokenAccountRoutes);
router.use("/VRT", VRTTokenRoutes);
router.use("/gamer", GamerRoutes);
router.use("/seedPhrase", SeedPhraseRoutes);
router.use("/block", BlockRoutes);
router.use("/transaction", TransactionRoutes);
router.use("/otp", OTPRoutes);
router.use("/email_verification", EmailVerificationRoutes);
router.use("/forgot_password", ForgotPasswordRoutes);
router.use("/account", AccountRoutes);
router.use("/token", TokenRoutes);
router.use("/VRT", VRTRoutes);
router.use("/block", BlockRoutes);
router.use("/fighter", FighterRoutes);

module.exports = router;