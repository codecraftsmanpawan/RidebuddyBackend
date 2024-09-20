const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emergencyContactSchema = new Schema({
    profileId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    contacts: [{
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
