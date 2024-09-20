const mongoose = require('mongoose');
const likeCommunityPostSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile', required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Like', likeCommunityPostSchema);
