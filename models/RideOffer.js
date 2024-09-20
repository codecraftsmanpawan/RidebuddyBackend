const mongoose = require('mongoose');
const RecurrenceSchema = require('./RecurrenceSchema'); 

const RideSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    sourceName: {
        type: String,
        required: true
    },
    sourcePoint: {
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        }
    },
    addStopName: {
        type: String
    },
    addStopPoints: {
        latitude: {
            type: String
        },
        longitude: {
            type: String
        }
    },
    destinationName: {
        type: String,
        required: true
    },
    destinationPoint: {
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        }
    },
    vehical: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle', 
        required: true
    },
    routes: {
        type: String,
        required: true
    },
    tripDistance: {
        type: String,
        required: true
    },
    tripDuration: {
        type: String,
        required: true
    },
    pickupTime: {
        type: String,
        required: true
    },
    pickupDate: {
        type: String,
        required: true
    },
    noOfSeat: {
        type: String,
        required: true
    },
    pricePerSeat: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'cancelled', 'completed'],
        default: 'scheduled'
    },
    recurrence: RecurrenceSchema,
    preferences: {
        smoking: {
            type: Boolean,
            default: false
        },
        pets: {
            type: Boolean,
            default: false
        },
        music: {
            type: Boolean,
            default: false
        }
    },
    femaleOnly: {
        type: Boolean,
        default: false
    },
    markAsComplete: {
        type: Boolean,
        default: false
    },
    markAsCompleteTime: {
        type: Date
    }
});

// Middleware to automatically set markAsCompleteTime when markAsComplete is set to true
RideSchema.pre('save', function(next) {
    if (this.markAsComplete && !this.markAsCompleteTime) {
        this.markAsCompleteTime = Date.now();
    }
    next();
});

const Ride = mongoose.model('Rideoffer', RideSchema);

module.exports = Ride;
