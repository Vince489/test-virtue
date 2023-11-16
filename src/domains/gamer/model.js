const mongoose = require('mongoose');

const gamerSchema = new mongoose.Schema({
  gamerTag: {
    type: String,
    required: true,
    unique: true,
  },
  email: { 
    type: String, 
    unique: true,
    required: true 
  },
  password: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    default: null,
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
