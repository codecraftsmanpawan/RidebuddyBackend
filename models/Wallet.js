const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile', // Ensure this matches your user model name
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    rewardsPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    carbonEmissionPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    totalRideOffers: [{
        type: Schema.Types.ObjectId,
        ref: 'RideOffer'
    }],
    totalRidesBooked: [{
        type: Schema.Types.ObjectId,
        ref: 'BookRide'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    transactions: [{ // Add this field to keep track of transactions
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
});

WalletSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Wallet', WalletSchema);
