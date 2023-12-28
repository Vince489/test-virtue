const mongoose = require('mongoose');

const promotionCompanySchema = new mongoose.Schema({
  // Owner of the promotion company
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gamer',
  },

  // Name of the promotion company
  name: {
    type: String,
    required: true,
  },

  // Promoters associated with the promotion company
  promoters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gamer',
  }],

  // Matchmakers associated with the promotion company
  matchMakers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MatchMaker',
  }],

  // Events organized by the promotion company
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],

  // Fighters associated with the promotion company
  roster: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fighter',
  }],

  // Token account associated with the promotion company
  tokenAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TokenAccount',
  },

  // URL or path to the promotion company's logo
  logo: {
    type: String,
    required: true,
  },

  // Virtual balance (VRT) associated with the promotion company
  vrtBalance: {
    type: Number,
    default: 0,
  },

  // Contact information
  contact: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },

  // Website of the promotion company
  website: {
    type: String,
  },

  // Badges associated with the promotion company
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  }],
});

const PromotionCompany = mongoose.model('PromotionCompany', promotionCompanySchema);

module.exports = PromotionCompany;
