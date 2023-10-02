// transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TokenAccount',
    },
    publicKey: {
      type: String,
      required: true,
    }
  },
  recipient: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TokenAccount',
    },
    publicKey: {
      type: String,
      required: true,
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
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
