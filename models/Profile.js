const mongoose = require('mongoose');

function charLimit(val) {
    return val.length <= 60;
}

function arrayLimit(val) {
    return val.length <= 5;
}

const ImageSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profilePicture: {
        type: ImageSchema
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        validate: [charLimit, '{PATH} exceeds the 60-character limit']
    },
    interests: {
        type: [String]
    },
    location: {
        type: String
    },
    images: {
        type: [ImageSchema],
        validate: [arrayLimit, '{PATH} exceeds the limit of 5']
    },
    prompts: {
        type: [String]
    },fcmToken:{
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'blocked'],
        default: 'active'
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);