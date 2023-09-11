const mongoose = require('mongoose');

const vrtSchema = new mongoose.Schema({
  mint: {
    type: String,
    default: 'VRT1111111111111111111111111111111111111111'
  },
  icon: {
    type: String,
    default: 'https://virtualrealitytoken.com/token.img'
  },
  symbol: {
    type: String,
    default: 'VRT'
  },
  mintAuthority: {
    type: String,
  },
  freezeAuthority: {
    type: String,
  },
  supply: {
    type: Number,
    default: 1000000000
  },
  balance: {
    type: Number,
    default: 1000000000
  },
  decimals: {
    type: Number,
    default: 6
  },
  frozen: {
    type: Boolean,
    default: false,
  }
});

const VRT = mongoose.model('VRT', vrtSchema);

module.exports = VRT;
