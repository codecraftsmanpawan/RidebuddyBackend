const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sos/sos');

// Route to create a new SOS request
router.post('/sos', sosController.createSOSRequest);

// Route to update an existing SOS request
router.put('/sos/:sosId', sosController.updateSOSRequest);

module.exports = router;
