const mongoose = require('mongoose');

const promoterSchema = new mongoose.Schema({
  gamerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gamer',
    required: true,
  },

  // Promoter details
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
  },

  // Fighters managed by the promoter
  managedFighters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fighter',
  }],

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

  // Promoter's virtual balance (VRT)
  vrtBalance: {
    type: Number,
    default: 1000,
  },

  // URL or path to the promoter's logo
  logo: {
    type: String,
    required: true,
  },

  // Badges associated with the promoter
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  }],
});

const Promoter = mongoose.model('Promoter', promoterSchema);

module.exports = Promoter;
