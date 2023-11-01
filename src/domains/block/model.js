const mongoose = require('mongoose');
const crypto = require('crypto');

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
    default: 1
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

blockSchema.pre('save', function (next) {
  // Create a hash based on the properties of the block
  const dataToHash = this.timeStamp + this.blockHeight + this.previousHash;
  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  this.hash = hash; // Set the hash field in the schema

  next();
});

const Block = mongoose.model('Block', blockSchema);

module.exports = Block;

