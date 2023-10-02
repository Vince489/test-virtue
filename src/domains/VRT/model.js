const mongoose = require('mongoose');

const vrtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Virtue' // Name of the cryptocurrency
  },
  symbol: {
    type: String,
    required: true,
    default: 'VRT' // Symbol or ticker for the cryptocurrency
  },
  totalSupply: {
    type: Number,
    required: true,
    default: 1000000000 // Total supply of VRT
  },
  balance: {
    type: Number,
    default: 1000000000
  },
  icon: {
    type: String,
    default: 'https://virtualrealitytoken.com/token.img'
  },
  frozen: {
    type: Boolean,
    default: false,
  }
});

const VRT = mongoose.model('VRT', vrtSchema);

module.exports = VRT;
