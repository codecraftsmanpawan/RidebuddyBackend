const Wallet = require('../../models/Wallet');

const addRewardsPoints = async (req, res) => {
    try {
        const wallet = await Wallet.findOneAndUpdate(
            { userId: req.params.userId },
            { $inc: { rewardsPoints: req.body.points } },
            { new: true }
        );
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = addRewardsPoints;