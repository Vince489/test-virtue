// fighter.js
const mongoose = require('mongoose');

const fighterSchema = new mongoose.Schema({
  gamerTag: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  }, 
  lastName: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
  },
  image: {
    type: String,
  },
  heightFt: {
    type: String,
    required: true,
  },
  heightIn: {
    type: String,
    required: true,
  },
  reach: {
    type: Number,
    required: true,
  },
  stance: {
    type: String,
    required: true,
  },
  weightClass: {
    type: String,
    required: true,
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  draws: {
    type: Number,
    default: 0,
  },
  knockouts: {
    type: Number,
    default: 0,
  },
  lossesByKnockout: {
    type: Number,
    default: 0,
  },
  ovr: {
    type: Number,
    required: true,
  },
  residence: {
    type: String,
  },
  vasa: {
    type: Boolean,
    default: false,
  },
  fights: {
    type: Number,
    default: 0,
  },
  rounds: {
    type: Number,
    default: 0,
  },
  nationality: {
    type: String,
    required: true,
  },
  manager: {
    type: String,
  },
  trainer: {
    type: String,
  },
  gym: {
    type: String,
  },
  promoter: {
    type: String,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  titles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Title',
  }],
  bouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bout',
  }],
  legacy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Legacy',
  }],
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  }],
});

const Fighter = mongoose.model('Fighter', fighterSchema);
module.exports = Fighter;
