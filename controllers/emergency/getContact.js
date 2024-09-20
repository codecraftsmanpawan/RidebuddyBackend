const mongoose = require('mongoose');
const EmergencyContact = require('../../models/Emergency');

exports.getContacts = async (req, res) => {
    const { profileId } = req.params;

    // Log the profileId for debugging
    console.log('Fetching contacts for profileId:', profileId);

    try {
        // Convert profileId to mongoose ObjectId
        const objectId = mongoose.Types.ObjectId(profileId);

        // Fetch the contact document
        const contact = await EmergencyContact.findOne({ profileId: objectId });

        // Log the fetched contact for debugging
        console.log('Fetched contact:', contact);

        if (!contact) {
            return res.status(404).json({ message: 'No emergency contacts found for this profile' });
        }

        // Return the contacts
        res.status(200).json(contact.contacts);
    } catch (err) {
        // Log the error for debugging
        console.error('Error retrieving emergency contacts:', err);
        res.status(500).json({ message: 'Failed to retrieve emergency contacts', error: err.message });
    }
};
