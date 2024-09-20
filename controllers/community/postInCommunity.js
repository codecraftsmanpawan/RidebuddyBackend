const FeedbackPost = require('../../models/Community');

// Create a new feedback post
exports.CommunityPost = async (req, res) => {
    const { content } = req.body;
    const image = req.file ? req.file.path : null;
    // console.log(content)
    // console.log(req.user.id)
    try {
        const feedback = new FeedbackPost({
            user: req.user.id,  // the user is authenticated and req.user contains user info
            content,
            image
        });


        await feedback.save();
        res.status(201).json({ message: 'Feedback post created successfully', feedback });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create feedback post' });
    }
};

