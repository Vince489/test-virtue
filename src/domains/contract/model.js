const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  contractId: {
    type: String,
    required: true,
  },
  promoterId: {
    type: String,
    required: true,
  },
  exclusive: {
    type: Boolean,
    default: false,
  },
  terms: {
    baseSalary: {
      type: Number,
      default: 0,
    },
    winBonus: {
      type: Number,
      default: 0,
    },
    contractDurationInFights: {
      type: Number,
      default: 0,
    },
    sponsorship: {
      active: {
        type: Boolean,
        default: false,
      },
      sponsor: {
        type: String,
      },
      sponsorshipTerms: {
        revenueSharing: {
          type: Number,
          default: 0,
        },
        promotionalObligations: {
          type: String,
        },
      },
    },
  },
});

const fighterSchema = new mongoose.Schema({
  gamerTag: {
    type: String,
  },
  // ... (other fields remain unchanged)

  contracts: [contractSchema], // Include the contracts field

  // ... (other fields remain unchanged)
});

const Fighter = mongoose.model('Fighter', fighterSchema);
module.exports = Fighter;
