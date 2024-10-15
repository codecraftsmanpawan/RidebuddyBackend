const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeedbackPost'
    },
    description: {
        type: String,
    },
    reportDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'Active'
    }
});

module.exports = mongoose.model('Report', reportSchema);