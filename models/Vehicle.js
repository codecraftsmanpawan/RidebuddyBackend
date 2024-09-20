const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    vehicleName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Diesel', 'Petrol', 'CNG', 'Electric'],
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    vehicleColor: {
        type: String,
        required: true
    },
    rcBookDetails: {
        type: String,
        required: true
    },
    rcResponses: {
        type: Object,
        required: true
    },
    dlDetails: {
        type: String,
        required: true
    },
    dlResponses: {
        type: Object,
        required: true
    },
    vehiclePicture: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);