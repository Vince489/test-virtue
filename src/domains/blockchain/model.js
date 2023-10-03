// blockchain.js

const mongoose = require('mongoose');

const blockchainSchema = new mongoose.Schema({
  blocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
  }],
  pendingTransactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
  slot: {
    type: Number,
    default: 0,
  },
  epoch: {
    type: Number,
    default: 0,
  },
  consensusRules: {
    consensusAlgorithm: 'Proof of Stake',
    maxValidators: 50,
    proposalThreshold: 75, // Percentage of validator approval required for protocol changes
    upgradeProtocol: 'BFT', // The protocol used for upgrades
  },  
})

const Blockchain = mongoose.model('Blockchain', blockchainSchema);

module.exports = Blockchain;