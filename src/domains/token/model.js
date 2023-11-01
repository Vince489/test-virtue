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
  },
  freezeAuthority: {
    type: String,
  },
  totalSupply: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default: 'Gaming',
  },
  decimals: {
    type: Number,
    default: 8,
  },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
