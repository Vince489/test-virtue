const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  seedPhrase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SeedPhrase',
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
    unique: true
  },
  privateKey: {
    type: String,
    required: true,
    unique: true
  },
  tokenAccounts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TokenAccount',
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
  vrtBalance: {
    type: Number, 
    default: 0,  
    required: true,
  },
  stake: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stake', // Reference to the associated stake
  },  
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;

