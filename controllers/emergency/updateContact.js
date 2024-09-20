const EmergencyContact = require('../../models/Emergency');

exports.updateContact = async (req, res) => {
    try {
        const { userId, contactIndex } = req.params;
        const { name, phoneNumber, relationship } = req.body;

        const emergencyContact = await EmergencyContact.findOne({ userId });
        if (!emergencyContact) return res.status(404).json({ message: 'No emergency contacts found for this user' });

        if (contactIndex < 0 || contactIndex >= emergencyContact.contacts.length) {
            return res.status(400).json({ message: 'Invalid contact index' });
        }

        emergencyContact.contacts[contactIndex] = { name, phoneNumber, relationship };
        await emergencyContact.save();

        res.status(200).json({ message: 'Emergency contact updated successfully', data: emergencyContact.contacts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};