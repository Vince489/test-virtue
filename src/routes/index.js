const express = require("express");
const router = express.Router();


const accountRoutes = require("./../domains/account");
const tokenAccountRoutes = require("./../domains/tokenAccount");
const VRTTokenRoutes = require("./../domains/VRT");
const gamerRoutes = require("./../domains/gamer");

router.use("/account", accountRoutes);
router.use("/tokenAccount", tokenAccountRoutes);
router.use("/VRT", VRTTokenRoutes);
router.use("/gamer", gamerRoutes);

module.exports = router;