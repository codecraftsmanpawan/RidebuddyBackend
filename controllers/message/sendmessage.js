const Message = require('../../models/Message');
const Profile = require('../../models/Profile');

const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        const senderProfile = await Profile.findById(senderId);
        const receiverProfile = await Profile.findById(receiverId);

        if (!senderProfile || !receiverProfile) {
            return res.status(400).json({ error: 'Sender or receiver profile not found.' });
        }
        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            message
        });

        const savedMessage = await newMessage.save();

        res.json(savedMessage);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = sendMessage;