const express = require("express");
const router = express.Router();


const AccountRoutes = require("./../domains/account");
const TokenAccountRoutes = require("./../domains/tokenAccount");
const VRTTokenRoutes = require("./../domains/VRT");
const GamerRoutes = require("./../domains/gamer");
const SeedPhraseRoutes = require("./../domains/seedPhrase");
const BlockRoutes = require("./../domains/block");
const TransactionRoutes = require("./../domains/transaction");
const TokenRoutes = require("./../domains/token");
const VRTRoutes = require("./../domains/VRT");
const FighterRoutes = require("./../domains/fighter");
const StakeRoutes = require("./../domains/stake");
const BlockchainRoutes = require("./../domains/blockchain");
const ValidatorRoutes = require("./../domains/validator");
const TitleRoutes = require("./../domains/title");

router.use("/account", AccountRoutes);
router.use("/tokenAccount", TokenAccountRoutes);
router.use("/VRT", VRTTokenRoutes);
router.use("/gamer", GamerRoutes);
router.use("/seedPhrase", SeedPhraseRoutes);
router.use("/block", BlockRoutes);
router.use("/transaction", TransactionRoutes);
router.use("/account", AccountRoutes);
router.use("/token", TokenRoutes);
router.use("/VRT", VRTRoutes);
router.use("/block", BlockRoutes);
router.use("/fighter", FighterRoutes);
router.use("/stake", StakeRoutes);
router.use("/blockchain", BlockchainRoutes);
router.use("/validator", ValidatorRoutes);
router.use("/title", TitleRoutes);

module.exports = router;