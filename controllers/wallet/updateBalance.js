const Wallet = require('../../models/Wallet');

const updateBalance = async (req, res) => {
    try {
        const wallet = await Wallet.findOneAndUpdate(
            { userId: req.params.userId },
            { $inc: { balance: req.body.amount } },
            { new: true }
        );
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = updateBalance;