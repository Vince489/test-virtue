const mongoose = require('mongoose');

const pendingTransactionSchema = new mongoose.Schema({
  transactionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction', // Reference to the transaction model
  }],
});

const PendingTransaction = mongoose.model('PendingTransaction', pendingTransactionSchema);

module.exports = PendingTransaction;
