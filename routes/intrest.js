const express = require('express');
const router = express.Router();
const { getAllInterests } = require('../controllers/getIntrest');

// Route to get all interests
router.get('/get-interest', getAllInterests);

module.exports = router;