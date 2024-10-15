const mongoose = require('mongoose');
const feedbackPostSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: [{
        type: String
    }],
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
    },
    report: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report'
        }
    ]
});
feedbackPostSchema.pre('save', function (next) {
    this.totalLikes = this.likes.length;
    next();
});
module.exports = mongoose.model('FeedbackPost', feedbackPostSchema);