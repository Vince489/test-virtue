const express = require("express");
const router = express.Router();
const SeedPhrase = require("./model");

// get all seedPhrases
router.get("/", async (req, res, next) => {
  try {
    const seedPhrases = await SeedPhrase.find();
    res.json(seedPhrases);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
