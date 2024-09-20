const BookRide = require('../../models/BookRide');
const Ride = require('../../models/RideOffer');

exports.acceptRideBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { userId } = req.user;
        const booking = await BookRide.findById(bookingId).populate('ride').populate('user');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        const ride = booking.ride;
        if (!ride) {
            return res.status(404).json({ success: false, message: 'Associated ride not found' });
        }
        if (String(ride.driver) !== String(userId)) {
            return res.status(403).json({ success: false, message: 'You are not authorized to accept this booking' });
        }
        if (ride.seatsOffered < booking.seatsBooked) {
            return res.status(400).json({ success: false, message: 'Not enough seats available' });
        }
        ride.seatsOffered -= booking.seatsBooked;
        await ride.save();
        booking.bookingStatus = 'confirmed';
        booking.rideUpdateDate = new Date();
        await booking.save();
        res.status(200).json({ success: true, message: 'Booking accepted successfully', booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to accept booking', error: error.message });
    }
};