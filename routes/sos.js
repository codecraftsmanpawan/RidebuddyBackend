const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sos'); // Adjust the path as needed

// Create a new SOS request
router.post('/sos', sosController.createSOSRequest);

// Update an existing SOS request
router.put('/sos/:sosId', sosController.updateSOSRequest);

module.exports = router;
