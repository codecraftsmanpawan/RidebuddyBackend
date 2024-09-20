const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    interest: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Interest = mongoose.model('Interest', interestSchema);

module.exports = Interest;