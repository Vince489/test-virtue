const mongoose = require('mongoose');

const pendingTransactionSchema = new mongoose.Schema({
  transactionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction', // Reference to the transaction model
  }],
  blockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block', // Reference to the block model
  },
});

const PendingTransaction = mongoose.model('PendingTransaction', pendingTransactionSchema);

module.exports = PendingTransaction;
