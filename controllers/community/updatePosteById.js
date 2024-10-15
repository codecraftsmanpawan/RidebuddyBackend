const FeedbackPost = require('../../models/Community')

exports.updatePostById = async (req, res) => {
    // const postId = req.params.id;
    try {
        const userId = req.user.id;
        // const userId = "66d015868f7fa4d910cc3ebf";
        const postId = req.params.id;
        // const postId = "66d01a078f7fa4d910cc3f00";
        const { content } = req.body;
        // check this post is created by current user or not

        const feedback = await FeedbackPost.findById(postId);
        if (!feedback) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (feedback.profile.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this post' });
        }

        feedback.content = content || feedback.content;
        await feedback.save();
        res.status(200).json({
            message: "Post updated successfully",
            feedback
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Post not updated"
        })
    }
}