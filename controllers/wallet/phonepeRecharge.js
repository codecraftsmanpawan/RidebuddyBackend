// controllers/walletController.js

const Wallet = require('../../models/Wallet');
const Transaction = require('../../models/TransactionSchema')


// Controller to add amount to wallet and log the transaction
exports.addAmountToWallet = async (req, res) => {
    try {
        // Validate request body
        const { userId, amount, paymentId, status } = req.body;

        // Convert amount from string to number
        const numericAmount = parseFloat(amount);

        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ error: "Invalid amount provided." });
        }

        // Find the wallet associated with the userId
        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            return res.status(404).json({ error: "Wallet not found for this user." });
        }

        // Determine transaction type based on context
        const transactionType = 'credit';

        // Create a new Transaction document
        const transaction = new Transaction({
            userId,
            walletId: wallet._id,
            amount: numericAmount, // Use the converted numeric amount
            transactionType,
            paymentId,
            status
        });

        // Save the transaction
        await transaction.save();

        // Update the wallet balance and add the transaction reference
        wallet.balance += numericAmount; // Add the numeric amount to the balance
        wallet.transactions.push(transaction._id);
        wallet.updatedAt = Date.now();

        await wallet.save();

        return res.status(200).json({
            message: "Amount added to wallet and transaction logged successfully.",
            wallet,
            transaction
        });
    } catch (error) {
        console.error("Error adding amount to wallet:", error);
        return res.status(500).json({ error: "An error occurred while updating the wallet." });
    }
};