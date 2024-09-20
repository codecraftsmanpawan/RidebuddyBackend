const mongoose = require('mongoose');
const { Schema } = mongoose;

// SelfieVerification schema definition
const selfieVerificationSchema = new Schema({
  code: { type: Number, required: true },
  status: { type: String, required: true },
  message: { type: String, required: true },
  request_id: { type: String, required: true, unique: true },
  response: {
    match_score: { type: String, required: true }
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  verified_at: { type: Date, default: Date.now },
  verified_selfie: { type: String, required: true } 
}, { timestamps: true });

const SelfieVerification = mongoose.model('SelfieVerification', selfieVerificationSchema);

module.exports = SelfieVerification;
