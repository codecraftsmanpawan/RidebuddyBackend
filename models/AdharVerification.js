const mongoose = require('mongoose');
const { Schema } = mongoose;

// Address sub-schema
const addressSchema = new Schema({
  country: { type: String, default: '' },
  dist: { type: String, default: '' },
  state: { type: String, default: '' },
  po: { type: String, default: '' },
  loc: { type: String, default: '' },
  vtc: { type: String, default: '' },
  subdist: { type: String, default: '' },
  street: { type: String, default: '' },
  house: { type: String, default: '' },
  landmark: { type: String, default: '' }
}, { _id: false });

// Response sub-schema
const responseSchema = new Schema({
  request_id: { type: String, required: true },
  aadhar: { type: String, required: true },
  name: { type: String, required: true },
  care: { type: String, default: '' },
  dob: { type: Date, default: null },
  gender: { type: String, default: '' },
  address: { type: addressSchema, default: () => ({}) },
  image: { type: String, default: '' },
  share_code: { type: String, default: '' },
  zip_file: { type: String, default: '' }
});

// AadharVerification schema definition
const aadharVerificationSchema = new Schema({
  verification_id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  code: { type: Number, default: null },
  status: { type: String, default: '' },
  message: { type: String, default: '' },
  request_id: { type: String, required: true },
  response: { type: responseSchema, required: true },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null
  },
  data: {
    type: Schema.Types.Mixed, // Allow mixed types
    default: null
  },
  verified_at: { type: Date, default: Date.now }
}, { timestamps: true });

// Create and export the AadharVerification model
const AadharVerification = mongoose.model('AadharVerification', aadharVerificationSchema);

module.exports = AadharVerification;
