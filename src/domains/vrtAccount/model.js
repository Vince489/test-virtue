const mongoose = require('mongoose');

const vrtAccountSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
});

const VRTAccount = mongoose.model('VRTAccount', vrtAccountSchema);

module.exports = VRTAccount;
