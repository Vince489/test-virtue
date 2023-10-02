const express = require("express");
const router = express.Router();


const accountRoutes = require("./../domains/account");
const tokenAccountRoutes = require("./../domains/tokenAccount");
const VRTTokenRoutes = require("./../domains/VRT");
const gamerRoutes = require("./../domains/gamer");
const seedPhraseRoutes = require("./../domains/seedPhrase");
const blockRoutes = require("./../domains/block");
const transactionRoutes = require("./../domains/transaction");

router.use("/account", accountRoutes);
router.use("/tokenAccount", tokenAccountRoutes);
router.use("/VRT", VRTTokenRoutes);
router.use("/gamer", gamerRoutes);
router.use("/seedPhrase", seedPhraseRoutes);
router.use("/block", blockRoutes);
router.use("/transaction", transactionRoutes);

module.exports = router;