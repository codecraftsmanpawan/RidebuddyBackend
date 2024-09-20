const Ride = require('../../models/RideOffer'); // Import the Ride model
const BookRide = require('../../models/BookRide'); // Import the BookRide model

exports.getRideOfferById = async (req, res) => {
    try {
        // Find the ride offer by ID and populate driver details
        const rideOffer = await Ride.findById(req.params.id)
            .populate('driver'); // Populate the driver reference

        if (!rideOffer) {
            return res.status(404).json({ success: false, message: 'Ride offer not found' });
        }

        // Find all bookings associated with this ride offer
        const bookings = await BookRide.find({ ride: req.params.id })
            .populate('user', 'name gender age'); // Populate the user profiles with selected fields

        // Extract user profiles from bookings
        const bookedPassengers = bookings.map(booking => booking.user);

        // Send the ride offer details and booked passengers in the response
        res.status(200).json({
            success: true,
            rideOffer,
            bookedPassengers
        });
    } catch (error) {
        // Handle errors and send an appropriate response
        res.status(500).json({ success: false, message: 'Failed to fetch ride offer', error: error.message });
    }
};
