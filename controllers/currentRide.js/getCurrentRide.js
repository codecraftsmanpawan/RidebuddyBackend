const ConfirmedRide = require('./models/ConfirmedRide');
const Profile = require('./models/Profile');
const Ride = require('./models/Ride');
const Vehicle = require('./models/Vehicle'); // Assuming you have a Vehicle model

// Controller function to get confirmed ride details
exports.getCurrentRideInfo = async (req, res) => {
    try {
        const { confirmRideId, profileId } = req.params;

        // Find the confirmed ride
        const confirmedRide = await ConfirmedRide.findById(confirmRideId)
            .populate({
                path: 'offeredRideId',
                populate: [
                    {
                        path: 'driver',
                        model: 'Profile',
                        select: 'profilePicture name' // Select only needed fields
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
            });

        if (!confirmedRide) {
            return res.status(404).json({ message: 'Confirmed ride not found' });
        }

        // Find the profile for the driver
        const driverProfile = confirmedRide.offeredRideId.driver;

        // Find emergency contacts for the profileId
        const profile = await Profile.findById(profileId)
            .select('emergencyContacts')
            .exec(); // Adjust the field name if different

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Prepare the response data
        const response = {
            confirmedRide: {
                ...confirmedRide.toObject(),
                driver: {
                    name: driverProfile.name,
                    profilePicture: driverProfile.profilePicture
                }
            },
            emergencyContacts: profile.emergencyContacts,
            bookingInfo: confirmedRide.passengers.find(p => p.profileId.equals(profileId)).bookRideId
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
