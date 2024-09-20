const express = require('express');
const router = express.Router();
const { getAllPrompts } = require('../controllers/getPrompt');

// Route to get all prompt
router.get('/get-prompt', getAllPrompts);

module.exports = router;