const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    aadharNumber: {
        type: String,
        required: true,
        unique: true
    },
    aadharOTP: {
        type: String,
        required: true
    },
    aadharVerificationResponse: {
        type: Object
    },
    faceID: {
        type: String,
        required: true
    },
    faceIDVerificationResponse: {
        type: Object
    },
    verifiedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Verification', VerificationSchema);