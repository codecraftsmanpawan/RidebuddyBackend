const RequestBooking = require('../../models/RequestBooking');
const Wallet = require('../../models/Wallet');
const ConfirmedRide = require('../../models/ConfirmedRide');
const { sendNotification } = require('../notifications/sendnotifications'); // Import the notification service
const Profile = require('../../models/Profile');

const handleDriverAction = async (req, res) => {
    const { bookingId, action } = req.body;
 
    try {
        const bookingRequest = await RequestBooking.findById(bookingId)
            .populate('userProfile') // Make sure userProfile has name and deviceToken
            .populate('offerRide'); // Ensure offerRide has driverProfile with deviceToken

            console.log("bookingRequest",bookingRequest)

        if (!bookingRequest) {
            return res.status(404).json({ message: 'Booking request not found' });
        }

        const driverProfile = await Profile.findById(bookingRequest.offerRide.driver);
        console.log("driverProfile",driverProfile)

        if (action === 'accept') {
            let confirmedRide = await ConfirmedRide.findOne({ offeredRideId: bookingRequest.offerRide });
            
            if (!confirmedRide) {
                confirmedRide = new ConfirmedRide({
                    rideId: bookingRequest.offerRide,
                    offeredRideId: bookingRequest.offerRide,
                    passengers: [{ profileId: bookingRequest.userProfile, bookRideId: bookingRequest._id }],
                    rideTotal: bookingRequest.paymentAmount
                });
            } else {
                confirmedRide.passengers.push({ profileId: bookingRequest.userProfile, bookRideId: bookingRequest._id });
                confirmedRide.rideTotal += bookingRequest.paymentAmount;
            }
            await confirmedRide.save();

            bookingRequest.bookingStatus = 'confirmed';
            await bookingRequest.save();
            // console.log("bookingRequest userProfile",bookingRequest.userProfile)
            
            // Notify the user about the acceptance
            await sendNotification({
                token: bookingRequest.userProfile.fcmToken, // Ensure userProfile has deviceToken
                title: 'Booking Accepted',
                body: `Your booking request from ${bookingRequest.pickupName} to ${bookingRequest.dropoffName} has been accepted.`,
                data: "MyRidesScreen",
                userId: bookingRequest.userProfile
            });

            // Notify the driver that the user has been added to their ride
            await sendNotification({
                token: driverProfile.fcmToken, // Ensure offerRide has driverProfile with deviceToken
                title: 'User Added to Your Ride',
                body: `${bookingRequest.userProfile.name} has been added to your ride from ${bookingRequest.pickupName} to ${bookingRequest.dropoffName}.`,
                data: "MyRidesScreen",
                userId: bookingRequest.offerRide.driver
            });

            res.status(200).json({ message: 'Booking request accepted successfully', confirmedRide });

        } else if (action === 'reject') {
            const wallet = await Wallet.findOne({ userId: bookingRequest.userProfile });
            if (!wallet) {
                return res.status(404).json({ message: 'Wallet not found' });
            }

            // Refund the amount to the wallet
            wallet.balance += bookingRequest.paymentAmount;
            await wallet.save();

            // Update the booking request status
            bookingRequest.bookingStatus = 'cancelled';
            await bookingRequest.save();

            // Notify the user about the rejection
            await sendNotification({
                token: bookingRequest.userProfile.fcmToken, // Ensure userProfile has deviceToken
                title: 'Booking Rejected',
                body: `Your booking request from ${bookingRequest.pickupName} to ${bookingRequest.dropoffName} has been rejected.`,
                data: "MyRidesScreen",
                userId: bookingRequest.userProfile
            });

            // Notify the driver about the cancellation
            await sendNotification({
                token: driverProfile.fcmToken, // Ensure offerRide has driverProfile with deviceToken
                title: 'Booking Request Cancelled',
                body: `You have cancelled ${bookingRequest.userProfile.name}'s request from ${bookingRequest.pickupName} to ${bookingRequest.dropoffName}.`,
                data: "MyRidesScreen",
                userId: bookingRequest.offerRide.driver
            });

            res.status(200).json({ message: 'Booking request rejected and amount refunded successfully' });

        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        console.error('Error handling driver action:', error);
        res.status(500).json({ message: 'Failed to handle driver action', error: error.message });
    }
};

module.exports = { handleDriverAction };
