const RequestBooking = require("../../models/RequestBooking");
const Wallet = require('../../models/Wallet');
const CurrentHolding = require('../../models/CurrentHolding');
const Ride = require('../../models/RideOffer');  // Import Ride model
const Profile = require('../../models/Profile');  // Import Profile model

const { sendNotification } = require('../notifications/sendnotifications'); // Import the notification service

const createBookingRequest = async (req, res) => {
    try {
        const {
            pickupName,
            dropoffName,
            pickupPoint,
            dropoffPoint,
            userProfile,
            offerRide,
            paymentAmount,
            noOfSeatsBooked
        } = req.body;

        // Find the user's wallet based on their profile ID
        const wallet = await Wallet.findOne({ userId: userProfile });
        const user=await Profile.findById(userProfile)

        // Check if the wallet exists and has enough balance
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        if (wallet.balance < paymentAmount) {
            return res.status(400).json({ message: 'Insufficient balance in wallet' });
        }

        // Deduct the payment amount from the wallet's balance
        wallet.balance -= paymentAmount;
      

        // Find the existing CurrentHolding record
        const currentHolding = await CurrentHolding.findOne();
 
        // Check if CurrentHolding exists
        if (!currentHolding) {
            return res.status(404).json({ message: 'Current holding not found' });
        }

        // Update the CurrentHolding amount
        currentHolding.Amount += paymentAmount;
        await currentHolding.save();
 
        // Create a new RequestBooking instance
        const newBookingRequest = new RequestBooking({
            pickupName,
            dropoffName,
            pickupPoint,
            dropoffPoint,
            userProfile,
            offerRide,
            paymentAmount,
            noOfSeatsBooked,
            paymentStatus: 'completed',
            bookingStatus: 'pending'
        });
        await wallet.save();
        // Save the booking request to the database
        await newBookingRequest.save();

        // Fetch the driver's profile using offerRide
        const ride = await Ride.findById(offerRide).populate('driver');
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
      
        const driverProfile = await Profile.findById(ride.driver._id);
        if (!driverProfile || !driverProfile.fcmToken) {
            return res.status(404).json({ message: 'Driver or FCM token not found' });
        }
       
        // Send notification to the driver using their FCM token
       
        await sendNotification({
            token: driverProfile.fcmToken,
            title: 'New Booking Request',
            body: `You have a new booking request from ${pickupName} to ${dropoffName}.`,
            actions: [
                { action: 'accept', title: 'Accept'  },
                { action: 'reject', title: 'Reject'  }
            ],
            navigation : "MyRidesScreen",
            userId: driverProfile._id,  // Use the driver's profile ID
        });

        // Send notification to the user that their request was placed successfully
        const userToken = 'user-device-token'; // Replace with actual user token from user profile
        await sendNotification({
            token: user.fcmToken,
            title: 'Request Placed Successfully',
            body: `Your booking request from ${pickupName} to ${dropoffName} has been placed successfully.`,
            navigation: "Home",
            userId:userProfile ,  // Pass the user ID
        });

        // Return success response
        res.status(201).json({
            message: 'Booking request created successfully',
            booking: newBookingRequest,
            walletBalance: wallet.balance,
            currentHolding: currentHolding
        });
    } catch (error) {
        console.error('Error creating booking request:', error);
        res.status(500).json({ message: 'Failed to create booking request', error: error.message });
    }
};

module.exports = { createBookingRequest };
