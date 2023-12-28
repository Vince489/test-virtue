const mongoose = require('mongoose');

const boxingOrgSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Virtron Boxing Commission',
    required: true
  },
  acronym: {
    type: String,
    default: 'VBC',
    required: true
  },
  logo: {
    type: String,
    default: 'https://virtronesports.com/img/VBC.png',
    required: true
  },
  beltImage: {
    type: String,
    default: 'https://virtronesports.com/img/VBC.png',
    required: true
  },
  boardMembers: {
    type: Array,
    required: true
  }
});


const BoxingOrg = mongoose.model('Boxing Org', boxingOrgSchema);

module.exports = BoxingOrg;