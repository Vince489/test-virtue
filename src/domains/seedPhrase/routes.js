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

// create a post request to retrieve account info from seedPhrase
router.post("/", async (req, res, next) => {
  try {
    const { seedPhrase } = req.body;
    const seedPhraseDocument = await SeedPhrase.findOne({ seedPhrase: seedPhrase });
    if (!seedPhraseDocument) {
      return res.status(404).json({ error: "Seed phrase not found." });
    }
    res.status(200).json(seedPhraseDocument);
  } catch (error) {
    next(error);
  }
});





module.exports = router;
