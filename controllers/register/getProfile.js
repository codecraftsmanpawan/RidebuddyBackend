const Profile = require('../../models/Profile');

const getProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        return res.status(200).json({ profile });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving profile', error: error.message });
    }
};

module.exports = {
    getProfile
};