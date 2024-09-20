const Message = require('../../models/Message');

const getMessagesBetweenProfiles = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
        .sort('timestamp')
        .populate({
            path: 'sender',
            select: 'name profilePicture',
            populate: {
                path: 'userId',
                select: 'mobile'
            }
        })
        .populate({
            path: 'receiver',
            select: 'name profilePicture',
            populate: {
                path: 'userId',
                select: 'mobile'
            }
        });

        res.json(messages);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = getMessagesBetweenProfiles;