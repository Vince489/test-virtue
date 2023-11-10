// transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    publicKey: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
    }
  },
  recipient: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    publicKey: {
      type: String,
    },
    balance: {
      type: Number,
    }
  },
  amount: {
    type: Number,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },    
  timestamp: {
    type: Date,
    default: Date.now,
  },
  confirmations: {
    type: Number,
    default: 0,
  },
  complete: {
    type: Boolean,
    default: false,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
