const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  timeStamp: {
    type: Date,
    default: () => new Date(),  
    required: true
  },
  blockHeight: {
    type: Number,
    index: true,
    required: true,
    default: 0
  },
  hash: {
    type: String,
    // required: true
  },
  previousHash: {
    type: String,
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
  signature: {
    type: String,
    // required: true
  },
  validator: {
    type: String,
    // required: true
  },
  validatorSignature: {
    type: String,
    // required: true
  }
});

const Block = mongoose.model('Block', blockSchema);

module.exports = Block;

