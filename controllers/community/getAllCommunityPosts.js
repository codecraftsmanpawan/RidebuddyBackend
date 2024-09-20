
const FeedbackPost = require('../../models/Community')

exports.getCommunityPosts = async (req, res) => {
    const user = req.user.id;
    try {

        const community = await FeedbackPost.find({
            // likes: { $nin: [user] } // getting all community post which not liked by me
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