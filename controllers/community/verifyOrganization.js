const FeedbackPost = require('../../models/Community')
const Profile = require('../../models/Profile');

exports.organizationPost = async (req, res) => {
    try {
        const profileId = req.userId;
        const profile = await Profile.findById(profileId).populate('userId');

        if (profile.userId.email === undefined || profile.userId.email === "undefined") {
            return res.status(400).json({ message: "User Have No Organization email" });
        }

        const domain = profile.userId.email.split('@')[1];

        const community = await FeedbackPost.find({})
            .populate({
                path: 'profile',
                populate: {
                    path: 'userId',
                    select: 'mobile email'
                }
            });

        const matchingPosts = community.filter(community => {
            if (community.profile?.userId?.email) {
                const communityEmail = community.profile.userId.email.split('@')[1];
                return domain === communityEmail;
            }
            return false;
        });

        if (matchingPosts.length > 0) {
            res.json({ posts: matchingPosts });
        } else {
            res.status(404).json({ message: 'No posts found for this organization' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying organization' });
    }
};