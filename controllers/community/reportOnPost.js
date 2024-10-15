const FeedbackPost = require('../../models/Community');
const Report = require('../../models/Report');
exports.reportOnPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        // const userId = "66d015868f7fa4d910cc3ebf";
        const { description } = req.body;
        const post = await FeedbackPost.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const reportAdded = new Report({
            post: postId,
            profile: userId,
            description: description
        });
        post.report.push(reportAdded._id);
        await reportAdded.save();
        await post.save();
        // add reoprt id in Feedback Post array
        res.json({ message: "Report submitted successfully", reportAdded });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}