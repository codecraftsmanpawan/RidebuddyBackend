const Ride = require('../../models/RideOffer');

exports.getRides = async (req, res) => {
    try {
        const rides = await Ride.find().populate('vehical');
        res.status(200).json({ success: true, rides });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch rides', error: error.message });
    }
};