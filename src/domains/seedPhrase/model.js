const mongoose = require('mongoose');

const seedPhraseSchema = new mongoose.Schema({
  seedPhrase: {
    type: String, 
    required: true,
    unique: true
  }
});

const SeedPhrase = mongoose.model('Seed Phrase', seedPhraseSchema);

module.exports = SeedPhrase;

