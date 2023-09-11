const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  seedPhrase: [],
  publicKey: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true
  },
  tokenAccounts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TokenAccount',
    required: true
  }],
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;

