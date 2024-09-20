const BookRide = require('../../models/BookRide');

exports.cancelBooking = async (req, res) => {
    try {
        const cancelledBooking = await BookRide.findByIdAndUpdate(
            req.params.id,
            {
                bookingStatus: 'cancelled',
                cancellationDate: Date.now()
            },
            { new: true }
        );

        if (!cancelledBooking) {
            return res.status(404).json({ success: false, message: 'Ride booking not found' });
        }

        res.status(200).json({ success: true, message: 'Ride booking cancelled successfully', booking: cancelledBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel ride booking', error: error.message });
    }
};