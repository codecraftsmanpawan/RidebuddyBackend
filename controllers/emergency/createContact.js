const EmergencyContact = require('../../models/Emergency');

exports.createContacts = async (req, res) => {
    const { profileId, name, phoneNumber, relationship } = req.body;

    try {
        let contact = await EmergencyContact.findOne({ profileId });

        if (!contact) {
            contact = new EmergencyContact({
                profileId,  // Correct field name
                contacts: [{ name, phoneNumber, relationship }]
            });
        } else {
            contact.contacts.push({ name, phoneNumber, relationship });
        }

        await contact.save();

        res.status(200).json({ message: 'Emergency contact added successfully', contact });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add emergency contact', error: err.message });
    }
};
