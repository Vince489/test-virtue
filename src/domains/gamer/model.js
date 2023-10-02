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
  verified: { 
    type: Boolean, 
    default: false 
  },
  signupDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    unique: true
  },
  fighters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fighter',
  }],
});

const Gamer = mongoose.model('Gamer', gamerSchema);
module.exports = Gamer;
