const mongoose = require('mongoose');
const ProfileSchema = require('./Profile'); 

const rcVerificationSchema = new mongoose.Schema({
  code: { type: Number, required: false },
  status: { type: String, required: false },
  message: { type: String, required: false },
  request_id: { type: String, required: false },
  response: {
    license_plate: { type: String, required: false, unique: true }, 
    owner_name: { type: String, required: false },
    is_financed: { type: String, default: '' },
    financer: { type: String, default: '' },
    insurance_company: { type: String, required: false },
    insurance_policy: { type: String, default: '' },
    insurance_expiry: { type: String },
    class: { type: String, required: false },
    registration_date: { type: String, required: false },
    vehicle_age: { type: String },
    pucc_number: { type: String, default: '' },
    chassis_number: { type: String, required: false },
    engine_number: { type: String, required: false },
    fuel_type: { type: String, required: false },
    brand_name: { type: String, required: false },
    brand_model: { type: String, required: false },
    cubic_capacity: { type: String, required: false },
    gross_weight: { type: String, required: false },
    cylinders: { type: String, required: false },
    color: { type: String, required: false },
    norms: { type: String, default: '' },
    noc_details: { type: String, default: '' },
    seating_capacity: { type: String, required: false },
    owner_count: { type: String, required: false },
    permit_number: { type: String, default: '' },
    permit_type: { type: String, default: '' },
    national_permit_number: { type: String, default: '' },
    national_permit_issued_by: { type: String, default: '' },
    rc_status: { type: String, required: false },
    vehicle_color: { type: String, default: '' }, // New 
    vehicle_fuel_type: { type: String, default: '' }, // New 
    vehicle_image: { type: String, default: '' } // New 
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  verified_at: { type: Date, default: Date.now }
}, { timestamps: true });

const RcVerification = mongoose.model('RcVerification', rcVerificationSchema);

module.exports = RcVerification;
