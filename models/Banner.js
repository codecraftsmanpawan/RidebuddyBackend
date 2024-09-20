const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  bannerImage: {
    type: String,
    required: true,
    trim: true
  },
  bannerLink: {
    type: String,
    required: true,
    trim: true
  },
  bannerType: {
    type: String,
    required: true,
    trim: true
  },
  bannerPosition: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model from the schema
const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;