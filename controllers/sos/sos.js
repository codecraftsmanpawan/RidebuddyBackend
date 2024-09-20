const SOS = require('../../models/sos'); // Assuming the SOS model is in the models directory
const ConfirmedRide = require('../../models/ConfirmedRide'); // Updated to use ConfirmedRide model
const Profile = require('../../models/Profile'); // Assuming the Profile model is in the models directory

// Create a new SOS request
exports.createSOSRequest = async (req, res) => {
    try {
        const { confirmRideId, profileId, liveLocation } = req.body;
console.log(confirmRideId, profileId, liveLocation);
        // Find the confirmed ride details using confirmRideId
        const confirmedRide = await ConfirmedRide.findById(confirmRideId).populate('passengers.profileId');
        if (!confirmedRide) {
            return res.status(404).json({ message: 'Confirmed ride not found' });
        }

        // Check if the profileId exists in the ride's passengers
        const passengerProfiles = confirmedRide.passengers.map(passenger => passenger.profileId.toString());
        if (!passengerProfiles.includes(profileId)) {
            return res.status(400).json({ message: 'Profile is not associated with this confirmed ride' });
        }

        // Create the SOS record
        const newSOS = new SOS({
            confirmRideId,
            profileId,
            liveLocation,
        });

        // Save the SOS record to the database
        const savedSOS = await newSOS.save();

        // Respond with the created SOS request
        return res.status(201).json({
            message: 'SOS request created successfully',
            sos: savedSOS
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while creating the SOS request',
            error: error.message
        });
    }
};

// Update an existing SOS request
exports.updateSOSRequest = async (req, res) => {
    try {
        const { sosId } = req.params;
        const updates = req.body;

        // Find the SOS entry by ID
        const sos = await SOS.findById(sosId);
        if (!sos) {
            return res.status(404).json({ message: 'SOS request not found' });
        }

        // Update fields if provided in the request body
        if (updates.liveLocation) {
            sos.liveLocation = updates.liveLocation;
        }
        // Add more fields here as needed

        // Save the updated SOS record
        const updatedSOS = await sos.save();

        // Respond with the updated SOS request
        return res.status(200).json({
            message: 'SOS request updated successfully',
            sos: updatedSOS
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while updating the SOS request',
            error: error.message
        });
    }
};
