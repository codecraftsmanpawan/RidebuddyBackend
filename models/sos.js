const mongoose = require('mongoose');
const { Schema } = mongoose;

const sosSchema = new Schema({
    confirmRideId: {
        type: Schema.Types.ObjectId,
        ref: 'ConfirmedRide', // Refers to the confirmed ride
        required: true,
    },
    profileId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile', // Refers to the profile of the user who pressed the SOS button
        required: true,
    },
    liveLocation: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },code:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('SOS', sosSchema);
