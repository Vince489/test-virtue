const mongoose = require('mongoose');

const stakeSchema = new mongoose.Schema({
  staker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', // Reference to the associated account that is staking
    required: true,
  },
  address: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  lockupPeriod: {
    type: Number, // You can use this to specify the lockup period for the stake
  },
  rewards: {
    type: Number, // Track the rewards earned from staking
    default: 0,
  },
  slashed: {
    type: Boolean, // Indicate if the stake has been slashed
    default: false,
  },
  slashingAmount: {
    type: Number, // Track the amount of slashing, if applicable
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Stake = mongoose.model('Stake', stakeSchema);

module.exports = Stake;
