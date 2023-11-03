const mongoose = require('mongoose');

const validatorSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true, // Each validator's address should be unique
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', 
    required: true,
  },
  stake: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stake', // Reference to the associated stake
    required: true,
  },
  active: {
    type: Boolean,
    default: true, // Validators are active by default
  },
});

const Validator = mongoose.model('Validator', validatorSchema);

module.exports = Validator;
