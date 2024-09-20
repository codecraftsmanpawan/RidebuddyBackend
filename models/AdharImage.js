// models/AdharImage.js

const mongoose = require('mongoose');

// Assuming you have a User model and each user has a unique profile ID
const adharImageSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('AdharImage', adharImageSchema);
