const Message = require('../../models/Message');

const markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.body.userId;

        const message = await Message.findOne({
            _id: messageId,
            receiver: userId,
            isRead: false
        });

        if (!message) {
            return res.status(404).json({ message: "No unread message found with the given ID for the current user." });
        }

        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { isRead: true },
            { new: true }
        );

        res.json(updatedMessage);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = markMessageAsRead;