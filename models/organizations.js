const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true  // Ensure the organization name is unique
    },
    type: {
        type: String,
        required: true,
         // Restrict the type to specific values
       
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

// Middleware to update `updatedAt` on document update

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
