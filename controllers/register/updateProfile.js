const Profile = require('../../models/Profile');
const path = require('path');

const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { bio, interests, images, prompts } = req.body;
    
    const profilePicture = req.files && req.files.profilePicture ? req.files.profilePicture[0].path : null;

    try {
        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profilePicture) profile.profilePicture = profilePicture;
        if (bio) {
            const isBioValid = wordLimit(bio);
            if (!isBioValid) {
                return res.status(400).json({ message: 'Bio exceeds the 120-word limit' });
            }
            profile.bio = bio;
        }
        if (interests) profile.interests = interests;
        if (images) {
            if (profile.images.length + images.length > 5) {
                return res.status(400).json({ message: 'Cannot upload more than 5 images' });
            }
            profile.images = [...profile.images, ...images];
        }
        if (prompts) profile.prompts = prompts;
        await profile.save();

        return res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

function wordLimit(val) {
    return val.split(' ').filter(word => word.length > 0).length <= 120;
}

module.exports = {
    updateProfile
};