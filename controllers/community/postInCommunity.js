const path = require('path')
const FeedbackPost = require('../../models/Community');

exports.CommunityPost = async (req, res) => {

    const userId = req.user.id;
    const { content } = req.body;
    const image = req.files ? req.files.map(file => path.join('uploads', 'Communityimages', file.filename).replace(/\\/g, '/')) : null;
    try {
        const feedback = new FeedbackPost({
            profile: userId,
            content,
            image
        });

        await feedback.save();
        console.log("object");
        res.status(201).json({ message: 'Feedback post created successfully', feedback });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create feedback post' });
    }
};
