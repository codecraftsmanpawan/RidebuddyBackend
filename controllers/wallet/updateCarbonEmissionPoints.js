const Wallet = require('../../models/Wallet');

const updateCarbonEmissionPoints = async (req, res) => {
    try {
        const wallet = await Wallet.findOneAndUpdate(
            { userId: req.params.userId },
            { $set: { carbonEmissionPoints: req.body.points } },
            { new: true }
        );
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = updateCarbonEmissionPoints;