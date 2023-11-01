const mongoose = require('mongoose');

const validatorSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true, // Each validator's address should be unique
  },
  publicKey: {
    type: String,
    required: true,
  },
  stake: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default: true, // Validators are active by default
  },
});

const Validator = mongoose.model('Validator', validatorSchema);

module.exports = Validator;
