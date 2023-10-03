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
    required: true,
  },
  freezeAuthority: {
    type: String,
    required: true,
  },
  supply: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
