const Verification = require('../../models/Verification');
const Profile = require('../../models/Profile');

// Perform Verification
const performVerification = async (req, res) => {
    const { profileId, aadharNumber, aadharOTP, aadharVerificationResponse, faceID, faceIDVerificationResponse } = req.body;

    try {
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const verification = new Verification({
            profile: profileId,
            aadharNumber,
            aadharOTP,
            aadharVerificationResponse,
            faceID,
            faceIDVerificationResponse
        });

        await verification.save();

        return res.status(201).json({ message: 'Verification completed successfully', verification });
    } catch (error) {
        return res.status(500).json({ message: 'Error performing verification', error: error.message });
    }
};

module.exports = {
    performVerification
};