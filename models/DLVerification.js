const mongoose = require('mongoose');
const { Schema } = mongoose;

const dlVerificationSchema = new Schema({
  code: { type: Number, default: null },
  status: { type: String, default: null },
  message: { type: String, default: null },
  request_id: { type: String, unique: true, default: null },
  response: {
    request_id: { type: String, default: null },
    license_number: { type: String, default: null },
    dob: { type: String, default: null },
    holder_name: { type: String, default: null },
    father_or_husband_name: { type: String, default: null },
    gender: { type: String, default: null },
    issue_date: { type: String, default: null },
    rto_code: { type: String, default: null },
    rto: { type: String, default: null },
    state: { type: String, default: null },
    valid_from: { type: String, default: null },
    valid_upto: { type: String, default: null },
    blood_group: { type: String, default: '' },
    vehicle_class: [{
      cov: { type: String, default: '' },
      expiryDate: { type: String, default: '' },
      issueDate: { type: String, default: '' }
    }],
    image: { type: String, default: '' }
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null
  },
  verified_at: { type: Date, default: null }
}, { timestamps: true });

const DLVerification = mongoose.model('DLVerification', dlVerificationSchema);

module.exports = DLVerification;
