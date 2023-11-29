// blockchain.js

const mongoose = require('mongoose');

const blockchainSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'DevChain',
  },
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
    type: mongoose.Schema.Types.Mixed, // Use Schema.Types.Mixed for arbitrary JSON objects
    default: {
      consensusAlgorithm: 'Proof of Stake, Proof of History',
      maxValidators: 20,
      proposalThreshold: 75,
      upgradeProtocol: 'BFT',
    },
  }, 
})

const Blockchain = mongoose.model('Blockchain', blockchainSchema);

module.exports = Blockchain;