const ConfirmedRide = require('../../models/ConfirmedRide'); 
const Profile = require('../../models/Profile');
const Ride = require('../../models/RideOffer');
const Vehicle = require('../../models/Vehicle');
const RequestBooking = require('../../models/RequestBooking'); // Assuming you have a RequestBooking model
const User = require('../../models/User');
// Controller function to get confirmed ride details
exports.getCurrentRideInfo = async (req, res) => {
    try {
        const { confirmRideId, profileId } = req.params;

        // Find the confirmed ride and convert to plain object
        const confirmedRide = await ConfirmedRide.findById(confirmRideId)
            .populate({
                path: 'offeredRideId',
                populate: [
                    {
                        path: 'driver',
                        model: 'Profile',
                        select: 'profilePicture name userId' // Select only needed fields
                    },
                    {
                        path: 'vehical',
                        model: 'Vehicle' // Assuming you have a Vehicle model
                    }
                ]
            })
            .populate({
                path: 'passengers',
                match: { profileId },
                select: 'bookRideId'
            })
            .lean(); // Use lean to get a plain JavaScript object

        if (!confirmedRide) {
            return res.status(404).json({ message: 'Confirmed ride not found' });
        }

        // Find the profile for the driver
        const driverProfile = confirmedRide.offeredRideId.driver;
        const driveNumber = await User.findById(driverProfile.userId).lean(); // Use lean here too

        // Find emergency contacts for the profileId
        const profile = await Profile.findById(profileId)
            .select('emergencyContacts')
            .lean(); // Use lean here too

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Find the booking request using the bookRideId
        const passenger = confirmedRide.passengers.find(p => p.profileId.equals(profileId));
        const bookingRequest = await RequestBooking.findById(passenger.bookRideId).lean(); // Use lean here too

        if (!bookingRequest) {
            return res.status(404).json({ message: 'Booking request not found' });
        }

        // Prepare the response data
        const response = {
            confirmedRide: {
                ...confirmedRide,
                driver: {
                    name: driverProfile.name,
                    profilePicture: driverProfile.profilePicture
                }
            },
            emergencyContacts: profile.emergencyContacts,
            driveDetais: driveNumber, // Ensure this is also a plain object
            bookingInfo: {
                bookingDetails: bookingRequest, // Include booking request details
                bookRideId: passenger.bookRideId
            }
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
