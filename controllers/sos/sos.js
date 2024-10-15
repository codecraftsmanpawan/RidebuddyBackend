const SOS = require('../../models/sos'); // Assuming the SOS model is in the models directory
const ConfirmedRide = require('../../models/ConfirmedRide'); // Updated to use ConfirmedRide model
const Profile = require('../../models/Profile'); // Assuming the Profile model is in the models directory

const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return code;
};

exports.createSOSRequest = async (req, res) => {
    try {
        const { confirmRideId, profileId, liveLocation } = req.body;
        
        // Find the confirmed ride
        const confirmedRide = await ConfirmedRide.findById(confirmRideId).populate('passengers.profileId');
        if (!confirmedRide) {
            return res.status(404).json({ message: 'Confirmed ride not found' });
        }

        // Generate a unique 5-character code
        const code = generateUniqueCode();

        // Create and save the new SOS record with the generated code
        const newSOS = new SOS({
            confirmRideId,
            profileId,
            liveLocation,
            code // Save the generated code
        });
        const savedSOS = await newSOS.save();

        // Send the response with the generated SOS code
        return res.status(201).json({
            message: 'SOS request created successfully',
            sos: savedSOS,
            sosCode: code // Send the generated code in the response
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error while creating SOS request',
            error: error.message
        });
    }
};

// Update SOS location periodically
exports.updateSOSRequest = async (req, res) => {
    try {
        const { sosId } = req.params;
        const { liveLocation } = req.body;
        console.log("update sos was called")

        // Find the SOS record
        const sos = await SOS.findById(sosId);
        if (!sos) {
            return res.status(404).json({ message: 'SOS request not found' });
        }

        // Update the live location
        sos.liveLocation = liveLocation || sos.liveLocation;
        const updatedSOS = await sos.save();

        return res.status(200).json({
            message: 'SOS request updated successfully',
            sos: updatedSOS
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error while updating SOS request',
            error: error.message
        });
    }
};
