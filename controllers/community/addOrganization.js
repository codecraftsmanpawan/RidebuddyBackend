const Organization = require('../../models/organizations');

exports.addOrganization = async (req, res) => {
    const { name, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({ message: 'Organization name and type are required.' });
    }

    try {
        // Check if the organization already exists
        let existingOrg = await Organization.findOne({ name });

        if (existingOrg) {
            // If the organization exists, notify the user they've been added to the community
            return res.status(200).json({ message: `You are added to the ${existingOrg.name} community.` });
        }

        // If the organization does not exist, create a new one
        const newOrganization = new Organization({ name, type });
        await newOrganization.save();

        // Respond with success message
        res.status(201).json({ message: 'Organization is added to our community.' });
    } catch (error) {
        console.error('Error adding organization:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

exports.getOrganizations = async (req, res) => {
    try {
        // Fetch all organizations from the database
        const organizations = await Organization.find();

        // Check if any organizations exist
        if (!organizations || organizations.length === 0) {
            return res.status(404).json({ message: 'No organizations found.' });
        }

        // Respond with the list of organizations
        res.status(200).json({
            message: 'Organizations retrieved successfully.',
            organizations
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
