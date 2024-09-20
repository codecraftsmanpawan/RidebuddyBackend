const Wallet = require('../../models/Wallet');

const getWalletDetails = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.params.userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = getWalletDetails;