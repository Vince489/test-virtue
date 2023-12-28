const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Virtron Boxing Commission',
    required: true,
  },
  acronym: {
    type: String,
    default: 'VBC',
    required: true,
  },
  image: {
    type: String,
    default: 'https://virtronesports.com/img/VBC.png',
    required: true,
  },
  weightClass: {
    type: String,
    enum: ['Lightweight', 'Super Middleweight'], // You can add more weight classes here
    required: true,
  },
  bout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bout',
  },
  receivedOn: {
    type: Date,
    default: Date.now,
  },
});








const Title = mongoose.model('Title', titleSchema);

module.exports = Title;