// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionType: { // e.g., 'credit' or 'debit'
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    status: { // e.g., 'success' or 'failure'
        type: String,
        enum: ['SUCCESS', 'FAILURE'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
