const mongoose = require('mongoose');

const gamerSchema = new mongoose.Schema({
  gamerTag: {
    type: String,
    required: true,
    unique: true,
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gamer',
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    default: null,
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  }],
  socialMedia: {
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitch: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  fighters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fighter',
  }],
  roles: {
    type: [String], // Store roles as an array of strings
    enum: ['gamer', 'promoter', 'trainer', 'admin'], 
    default: ['gamer']
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  signupDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Gamer = mongoose.model('Gamer', gamerSchema);
module.exports = Gamer;
