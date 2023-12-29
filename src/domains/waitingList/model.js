// models/WaitingListModel.js

const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
  gamerTag: {
    type: String,
    unique: true,
    required: true,
  },
}, { timestamps: true });

const WaitingList = mongoose.model('WaitingList', waitingListSchema);

module.exports = WaitingList;
