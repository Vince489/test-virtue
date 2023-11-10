// token.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  mint: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mintAuthority: {
    type: String,
    required: true
  },
  freezeAuthority: {
    type: String,
  },
  totalSupply: {
    type: Number,
    default: 0,
    required: true,
  },
  type: {
    type: String,
    default: 'Gaming',
    required: true,
  },
  decimals: {
    type: Number,
    default: 6,
    required: true,
  },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
