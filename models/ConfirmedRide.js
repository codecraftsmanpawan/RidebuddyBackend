const mongoose = require('mongoose');

const confirmedRideSchema = new mongoose.Schema({
   
    offeredRideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rideoffer', // Refers to the offered ride
        required: true
    },
    passengers: [{
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        },
        bookRideId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BookRide', // Refers to each passenger's booking
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'started', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },rideTotal:{
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const ConfirmedRide = mongoose.model('ConfirmedRide', confirmedRideSchema);
module.exports = ConfirmedRide;
