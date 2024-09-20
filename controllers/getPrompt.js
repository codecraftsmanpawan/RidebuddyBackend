const Prompt = require('../models/Prompt');

const getAllPrompts = async (req, res) => {
    try {
        const prompts = await Prompt.find();
        res.status(200).json(prompts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prompts', error: error.message });
    }
};

module.exports = {
    getAllPrompts
};
