const Ride = require('../../models/RideOffer');

exports.updateRide = async (req, res) => {
    try {
        const { sourceName, sourcePoint, addStopName, addStopPoints, destinationName, destinationPoint, vehical, routes, tripDistance, tripDuration, pickupTime, pickupDate, noOfSeat, pricePerSeat, status } = req.body;

        const updatedRide = await Ride.findByIdAndUpdate(req.params.id, {
            sourceName,
            sourcePoint,
            addStopName,
            addStopPoints,
            destinationName,
            destinationPoint,
            vehical,
            routes,
            tripDistance,
            tripDuration,
            pickupTime,
            pickupDate,
            noOfSeat,
            pricePerSeat,
            status
        }, { new: true }).populate('vehical');

        if (!updatedRide) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        res.status(200).json({ success: true, message: 'Ride updated successfully', ride: updatedRide });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update ride', error: error.message });
    }
};