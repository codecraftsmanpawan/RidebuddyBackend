const Verification = require('../../models/Verification');
const Profile = require('../../models/Profile');

const getVerificationDetails = async (req, res) => {
    const { verificationId } = req.params;

    try {
        const verification = await Verification.findById(verificationId).populate('profile');
        if (!verification) {
            return res.status(404).json({ message: 'Verification not found' });
        }

        return res.status(200).json({ verification });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving verification details', error: error.message });
    }
};

module.exports = {
    getVerificationDetails
};
