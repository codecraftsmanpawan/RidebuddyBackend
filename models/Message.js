const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('Message', MessageSchema);