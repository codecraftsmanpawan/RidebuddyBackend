const FeedbackPost = require('../../models/Community');

exports.deletePostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        // const userId ="66d015868f7fa4d910cc3ebf";
        // console.log(userId);
        const findpost = await FeedbackPost.findById(postId);
        if (!findpost) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (findpost.profile.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this post' });
        }

        // remove findPost
        await findpost.remove()
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Post not updated"
        })
    }
}