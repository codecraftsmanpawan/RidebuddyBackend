const RequestBooking = require('../../models/RequestBooking');
const RideOffer = require('../../models/RideOffer');
const ConfirmedRide = require('../../models/ConfirmedRide');
const Profile = require('../../models/Profile');

const getRidesByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Fetch the user profile
        const userProfile = await Profile.findById(userId, 'name age gender interests');  // Only include required fields

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Fetch booked rides (where the user is a passenger)
        const bookedRides = await RequestBooking.find({ userProfile: userId })
            .populate({
                path: 'offerRide',
                model: 'RideOffer',
                select: 'pickupTime time tripDuration sourceName destinationName seatsOffered tripDistance vehicle.brand_model pricePerSeat',
                populate: { path: 'driver', select: 'name', model: 'Profile' }  // Populate the driver field
            })
            .populate('userProfile', 'name');


        // Fetch offered rides (where the user is the driver)
        const offeredRides = await RideOffer.find({ driver: userId }, 'pickupTime time tripDuration sourceName destinationName seatsOffered tripDistance vehicle.brand_model pricePerSeat')
            .populate({
                path: 'driver', 
                select: 'name',
                model: 'Profile' // Populate the driver from Profile model
            });

        // Fetch confirmed rides (either as passenger or driver)
        const confirmedRides = await ConfirmedRide.find({
            $or: [
                { 'passengers.profileId': userId },  // User is a passenger
                { offeredRideId: { $in: offeredRides.map(ride => ride._id) } }  // User is the driver
            ]
        })
        .populate({
            path: 'offeredRideId',
            model: 'RideOffer',
            select: 'pickupTime tripDuration sourceName destinationName seatsOffered tripDistance vehicle.brand_model pricePerSeat',
            populate: { path: 'driver', select: 'name', model: 'Profile' }
        })
        .populate({
            path: 'passengers.profileId',
            select: 'name',
            model: 'Profile'
        });

        // Respond with all rides data
        return res.status(200).json({
            success: true,
            message: 'Rides fetched successfully',
            data: {
                userProfile,  // The user profile
                bookedRides,  // Rides the user has booked
                offeredRides, // Rides the user has offered as a driver
                confirmedRides // Rides the user is involved in (as driver or passenger)
            }
        });
    } catch (error) {
        console.error('Error fetching rides:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching rides',
            error: error.message
        });
    }
};

module.exports = {
    getRidesByUserId
};