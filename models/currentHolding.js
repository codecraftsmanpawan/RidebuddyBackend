const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const currentHoldingSchema = new Schema({
    Amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Check if the model already exists
const CurrentHolding = mongoose.models.CurrentHolding || mongoose.model('CurrentHolding', currentHoldingSchema);

module.exports = CurrentHolding;
