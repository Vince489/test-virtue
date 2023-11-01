// tokenAccount.js
const mongoose = require('mongoose');

const tokenAccountSchema = new mongoose.Schema({
  mint: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', 
    required: true,
    default: null
  },
  balance: {
    type: Number,
    default: 0
  },
  isFrozen: {
    type: Boolean,
    default: false
  },
  airdropReceived: {
    type: Boolean,
    default: false
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
});

const TokenAccount = mongoose.model('TokenAccount', tokenAccountSchema);

module.exports = TokenAccount;
