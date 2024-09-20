const Interest = require('../models/Interest');

const getAllInterests = async (req, res) => {
    try {
        const interests = await Interest.find();
        res.status(200).json(interests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching interests', error: error.message });
    }
};

module.exports = {
    getAllInterests
};