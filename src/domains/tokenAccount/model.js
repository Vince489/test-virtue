// tokenAccount.js
const mongoose = require('mongoose');

const tokenAccountSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gamer', 
    required: true,
  },
  token: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
    required: true,    
  },
  publicKey: {
    type: String,
    required: true,
    unique: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
});

const TokenAccount = mongoose.model('TokenAccount', tokenAccountSchema);

module.exports = TokenAccount;
