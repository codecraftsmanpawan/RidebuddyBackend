const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestBookingSchema = new Schema({
  pickupName: {
    type: String,
    required: true,
  },
  dropoffName: {
    type: String,
    required: true,
  },
  pickupPoint: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    }
  },
  dropoffPoint: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    }
  },
  userProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  offerRide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rideoffer',
    required: true,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  noOfSeatsBooked: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  } , paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
},
bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'pending'],
    default: 'pending'
},
});

const RequestBooking = mongoose.model('RequestBooking', RequestBookingSchema);

module.exports = RequestBooking;