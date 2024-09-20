const BookRide = require('../../models/BookRide');

exports.updateBooking = async (req, res) => {
    try {
        const { seatsBooked, totalAmount, travelDate, pickupTime, pickupName, pickupPoint, dropoffName, dropoffPoint, bookingStatus, paymentStatus } = req.body;

        const updatedBooking = await BookRide.findByIdAndUpdate(
            req.params.id,
            {
                seatsBooked,
                totalAmount,
                travelDate,
                pickupTime,
                pickupName,
                pickupPoint,
                dropoffName,
                dropoffPoint,
                bookingStatus,
                paymentStatus,
                rideUpdateDate: Date.now() // Update the rideUpdateDate to the current date and time
            },
            { new: true }
        ).populate('ride user');

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Ride booking not found' });
        }

        res.status(200).json({ success: true, message: 'Ride booking updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update ride booking', error: error.message });
    }
};