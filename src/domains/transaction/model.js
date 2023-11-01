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
  },    
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
