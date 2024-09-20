const mongoose = require('mongoose');
const Profile = require('../../models/Profile');
const Wallet = require('../../models/Wallet');
const Ride = require('../../models/RideOffer');
const ConfirmedRide = require('../../models/ConfirmedRide');
const RequestBooking = require('../../models/RequestBooking');
const CurrentHolding = require('../../models/CurrentHolding');
const {sendNotification} = require('../notifications/sendnotifications');


exports.cancelConfirmedRide = async (req, res) => {
    const { bookingId, userId } = req.body;
    console.log("bookingId", bookingId);

    try {
        // Find the confirmed ride where the passenger's booking ID matches
        const confirmedRide = await ConfirmedRide.findOne({ 'passengers.bookRideId': bookingId }).populate('offeredRideId passengers.profileId');
        console.log("confirmedRide", confirmedRide);
        if (!confirmedRide) {
            return res.status(404).json({ message: 'Confirmed ride not found' });
        }

        const user = await Profile.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the total cost of the ride from the booking request
        const bookingRequest = await RequestBooking.findById(bookingId);
        if (!bookingRequest) {
            return res.status(404).json({ message: 'Booking request not found' });
        }

        const rideTotal = bookingRequest.paymentAmount;

        // Calculate refund amounts
        const refundToUser = 0.85 * rideTotal;  // 85% refund to the user
        const paymentToDriver = 0.10 * rideTotal;  // 10% payment to the driver
        const totalDeduction = refundToUser + paymentToDriver;  // 95% deduction from company's current holdings

        // Find the user's wallet
        const userWallet = await Wallet.findOne({ userId });
        if (!userWallet) {
            return res.status(404).json({ message: 'User wallet not found' });
        }
        const driverProfile = await Profile.findById(confirmedRide.offeredRideId.driver);
        // Find the driver's wallet using the driverProfile ID from the ride offer
        const driverWallet = await Wallet.findOne({ userId: confirmedRide.offeredRideId.driver });
        if (!driverWallet) {
            return res.status(404).json({ message: 'Driver wallet not found' });
        }

        // Find the company's current holding
        const currentHolding = await CurrentHolding.findOne();
        if (!currentHolding || currentHolding.Amount < totalDeduction) {
            return res.status(400).json({ message: 'Insufficient funds in current holdings to process the refund' });
        }

        // Refund 85% to the user
        userWallet.balance += refundToUser;
        await userWallet.save();

        // Transfer 10% to the driver
        driverWallet.rewardsPoints += paymentToDriver;
        await driverWallet.save();

        // Deduct 95% from the company's current holdings
        currentHolding.Amount -= totalDeduction;
        await currentHolding.save();

        // Remove the passenger who canceled the ride from the confirmed ride's passenger list
        confirmedRide.passengers = confirmedRide.passengers.filter(passenger => passenger.bookRideId.toString() !== bookingId);
        // await confirmedRide.save();

        // Notify the user about the cancellation and refund
        await sendNotification({
            token:user.fcmToken,
            title: 'Ride Cancelled',
            body: `Your ride has been cancelled. You have been refunded ₹${refundToUser}.`,
            data: "MyRidesScreen",
            userId: userId
        });

        // Notify the driver about the cancellation and payment
        await sendNotification({
            token: driverProfile.fcmToken,
            title: 'Ride Cancelled',
            body: `The ride with booking ID ${bookingId} has been cancelled. You have received ₹${paymentToDriver}.`,
            data: "MyRidesScreen",
            userId: confirmedRide.offeredRideId.driver
        });

        res.status(200).json({
            message: 'Ride cancelled successfully',
            refundToUser,
            paymentToDriver,
            currentHoldingBalance: currentHolding.Amount
        });

    } catch (error) {
        console.error('Error cancelling ride:', error);
        res.status(500).json({ message: 'Failed to cancel ride', error: error.message });
    }
};

exports.cancelRequestBooking = async (req, res) => {
    const { bookingId,driverId } = req.body;

    if (!bookingId) {
        return res.status(400).json({ message: 'Booking ID is required' });
    }

    try {
        // Find the booking request by ID and populate offerRide and userProfile
        const bookingRequest = await RequestBooking.findById(bookingId)
          
        if (!bookingRequest) {
            return res.status(404).json({ message: 'Booking request not found' });
        }

        const userProfile = bookingRequest.userProfile;
        const user = await Profile.findById(userProfile);
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
      
        console.log("userProfile",userProfile)

       
        const driverProfile = await Profile.findById(driverId);

        if (!driverProfile) {
            return res.status(404).json({ message: 'Driver profile not found' });
        }

        // Find the user's wallet and the company's current holding
        const [userWallet, currentHolding] = await Promise.all([
            Wallet.findOne({ userId: userProfile }),
            CurrentHolding.findOne()
        ]);

        if (!userWallet) {
            return res.status(404).json({ message: 'User wallet not found' });
        }

        if (!currentHolding) {
            return res.status(404).json({ message: 'Current holding not found' });
        }

        // Refund the payment amount back to the user's wallet
        userWallet.balance += bookingRequest.paymentAmount;
        await userWallet.save();

        // Deduct the payment amount from the current holding
        if (currentHolding.Amount < bookingRequest.paymentAmount) {
            return res.status(400).json({ message: 'Insufficient funds in current holding to refund the user' });
        }

        currentHolding.Amount -= bookingRequest.paymentAmount;
        await currentHolding.save();


        await sendNotification({
            token: user.fcmToken, 
            title: 'Booking Request Cancelled',               
            body: `The booking request from ${bookingRequest.pickupName} to ${bookingRequest.dropoffName} has been cancelled by the user.`,
            data: { bookingId: bookingRequest._id.toString() },
            userId: userProfile
        });

        // Send notification to the driver about the cancellation
        if (driverProfile.fcmToken) {
            await sendNotification({
                token: driverProfile.fcmToken, 
                title: 'Booking Request Cancelled',               
                body: `The booking request from ${bookingRequest.pickupName} to ${bookingRequest.dropoffName} has been cancelled by the user.`,
                data: { bookingId: bookingRequest._id.toString() },
                userId: driverId
            });
        } else {
            console.warn('Driver device token is not available');
        }

        // Delete the booking request
        await bookingRequest.remove();

        res.status(200).json({ message: 'Booking request cancelled and amount refunded successfully' });

    } catch (error) {
        console.error('Error cancelling booking request:', error);
        res.status(500).json({ message: 'Failed to cancel booking request', error: error.message });
    }
};

exports.getBookingDetailsById = async (req, res) => {
    const { bookingId } = req.params;

    if (!bookingId) {
        return res.status(400).json({ message: 'Booking ID is required' });
    }

    try {
        console.log('Fetching booking with ID:', bookingId);

        // Fetch the booking request and populate related data
        const bookingRequest = await RequestBooking.findById(bookingId)
            .populate('userProfile')
            .populate({
                path: 'offerRide',
                populate: {
                    path: 'driver'
                }
            });

        if (!bookingRequest) {
            return res.status(404).json({ message: 'Booking request not found' });
        }

        // Log the populated request for debugging
        console.log('Populated Booking Request:', bookingRequest);

        // If the profile and ride are not populated, log the IDs for debugging
        if (!bookingRequest.userProfile) {
            console.log('User Profile ID:', bookingRequest.userProfile);
        }
        if (!bookingRequest.offerRide) {
            console.log('Offer Ride ID:', bookingRequest.offerRide);
        }

        // Extract related data
        const userProfile = bookingRequest.userProfile;
        const offerRide = bookingRequest.offerRide;
        const driverProfile = offerRide ? offerRide.driver : null;

        // Log extracted data for debugging
        console.log('User Profile:', userProfile);
        console.log('Offer Ride:', offerRide);
        console.log('Driver Profile:', driverProfile);

        res.status(200).json({
            bookingRequest,
            userProfile,
            offerRide,
            driverProfile
        });

    } catch (error) {
        console.error('Error fetching booking request:', error);
        res.status(500).json({ message: 'Failed to fetch booking request', error: error.message });
    }
};


exports.createOrUpdateCurrentHolding = async (req, res) => {
    const { initialBalance } = req.body;

    try {
        // Check if a CurrentHolding record already exists
        let currentHolding = await CurrentHolding.findOne();

        if (!currentHolding) {
            // Create a new CurrentHolding record if it doesn't exist
            currentHolding = new CurrentHolding({ Amount: initialBalance });
            await currentHolding.save();
            return res.status(201).json({ message: 'CurrentHolding account created', data: currentHolding });
        }

        // Update the balance if the record already exists
        currentHolding.Amount = initialBalance;
        await currentHolding.save();
        res.status(200).json({ message: 'CurrentHolding account updated', data: currentHolding });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


