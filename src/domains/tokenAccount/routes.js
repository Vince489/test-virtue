const express = require("express");
const router = express.Router();
const tokenAccount = require("./model");


// create new TokenAccount
router.post("/", async (req, res, next) => {
  try {
    const tokenAccount = new tokenAccount({
      mint: req.body.mint,
      owner: req.body.owner,
      balance: req.body.balance,
      isFrozen: req.body.isFrozen,
      airdropReceived: req.body.airdropReceived,
      transactions: req.body.transactions,
    });
    await tokenAccount.save();
    res.json(tokenAccount);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
