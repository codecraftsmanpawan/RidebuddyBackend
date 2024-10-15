
const FeedbackPost = require('../../models/Community')

exports.getCommunityPosts = async (req, res) => {
    // const user = req.user.id;
    try {
        // const profile = await Profile.find({});
        // return res.json(profile)
        const community = await FeedbackPost.find({})
            .populate({
                path: 'profile', // Populate the profile field
                populate: {
                    path: 'userId', // Populate the userId field within the profile
                    select: 'mobile email' // Specify fields to return from the user
                }
            });

        for (let i = 0; i < community.length; i++) {
            if (community[i]) {
                community[i].totalLikes = community[i].likes.length;
            }
        }
        res.status(200).json({
            success: true,
            community,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error fetching community" });
    }
}