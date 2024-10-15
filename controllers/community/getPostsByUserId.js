const Feedback = require('../../models/Community');
exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        // const userId = "66d015868f7fa4d910cc3ebf";
        const posts = await Feedback.find(
            {
                profile: userId
            }
        );
        res.status(200).json({
            success: 200,
            message: "Post Fetched",
            posts
        })
    } catch (error) {
        res.status(500).json(
            {
                message: "server Error"
            }
        )
    }
}