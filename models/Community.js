const mongoose = require('mongoose');
const feedbackPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    totalLikes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('FeedbackPost', feedbackPostSchema);