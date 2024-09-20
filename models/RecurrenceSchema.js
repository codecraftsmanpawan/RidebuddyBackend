const mongoose = require('mongoose');

const RecurrenceSchema = new mongoose.Schema({
    daysOfWeek: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }
}, { _id: false });

module.exports = RecurrenceSchema;
