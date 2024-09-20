const mongoose = require('mongoose');
const EmergencyContact = require('../../models/Emergency');

exports.deleteContact = async (req, res) => {
    const { profileId, contactId } = req.body;

    try {
        // Log the profileId and contactId for debugging
        console.log('Deleting contact for profileId:', profileId, 'and contactId:', contactId);

        // Convert profileId to mongoose ObjectId
        const objectIdProfile = mongoose.Types.ObjectId(profileId);

        // Fetch the contact document
        const contact = await EmergencyContact.findOne({ profileId: objectIdProfile });

        if (!contact) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Convert contactId to mongoose ObjectId
        const objectIdContact = mongoose.Types.ObjectId(contactId);

        // Filter out the contact to be deleted
        contact.contacts = contact.contacts.filter(c => !c._id.equals(objectIdContact));

        // Save the updated contact document
        await contact.save();

        res.status(200).json({ message: 'Emergency contact deleted successfully', contact });
    } catch (err) {
        // Log the error for debugging
        console.error('Error deleting emergency contact:', err);
        res.status(500).json({ message: 'Failed to delete emergency contact', error: err.message });
    }
};
