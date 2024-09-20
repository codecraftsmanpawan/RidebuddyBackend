const Ride = require('../../models/RideOffer');

exports.deleteRide = async (req, res) => {
    try {
        const ride = await Ride.findByIdAndDelete(req.params.id);
        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }
        res.status(200).json({ success: true, message: 'Ride deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete ride', error: error.message });
    }
};