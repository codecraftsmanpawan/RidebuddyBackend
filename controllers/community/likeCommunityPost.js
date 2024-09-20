
const FeedbackPost = require('../../models/Community');

// Like a feedback post
exports.likePost = async (req, res) => {
    const feedbackId = req.params.id;

    try {
        const feedback = await FeedbackPost.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback post not found' });
        }

        const user = req.user.id;
        const hasLiked = feedback.likes.includes(user);

        if (hasLiked) {
            return res.status(400).json({ error: 'You have already liked this post' });
        }

        feedback.likes.push(user);
        await feedback.save();

        res.status(200).json({ message: 'Post liked successfully', feedback });
    } catch (error) {
        res.status(500).json({ error: 'Failed to like the feedback post' });
    }
};
