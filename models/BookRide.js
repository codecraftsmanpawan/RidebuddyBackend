const mongoose = require('mongoose');

const bookRideSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RideOffer',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    seatsBooked: {
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    bookingStatus: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed', 'pending'],
        default: 'pending'
    },
    bookingDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    travelDate: {
        type: Date,
        required: true
    },
    rideUpdateDate: {
        type: Date
    },
    cancellationDate: {
        type: Date
    },
    pickupTime: {
        type: Date,
        required: true
    },
    pickupName: {
        type: String,
        required: true
    },
    pickupPoint: {
        latitude: {
            type: String,
            required: true,
        },
        longitude: {
            type: String,
            required: true
        }
    },
    dropoffName: {
        type: String,
        required: true
    },
    dropoffPoint: {
        latitude: {
            type: String,
            required: true,
        },
        longitude: {
            type: String,
            required: true
        }
    }


});

bookRideSchema.virtual('rideStatus').get(function () {
    const now = new Date();
    const pickupTime = new Date(this.pickupTime);
    let status = '';

    if (pickupTime < now) {
        status = 'Recent';
    } else if (pickupTime.toDateString() === now.toDateString()) {
        status = now < pickupTime ? 'Upcoming Ride' : 'Current Ride';
    } else {
        status = 'Upcoming Ride';
    }

    return status;
});

const BookRide = mongoose.model('BookRide', bookRideSchema);
module.exports = BookRide;