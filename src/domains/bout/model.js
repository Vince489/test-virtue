const mongoose = require('mongoose');

const boutSchema = new mongoose.Schema({
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fighter',
  },
  nonLeagueOpponent: {
    type: String
  },
  result: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  round: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
  },
  venue: {
    type: String
  }
});

const Bout = mongoose.model('Bout', boutSchema);

module.exports = Bout;
