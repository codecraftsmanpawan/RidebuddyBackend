const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    base64Data: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        default: 'image/jpeg', // Default to JPEG, but you can adjust as needed
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Image', ImageSchema);
