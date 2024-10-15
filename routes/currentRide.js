const express = require('express');
const router = express.Router();

// Importing the controller functions
const { getCurrentRideInfo } = require('../controllers/currentRide/getCurrentRide'); // Adjust the path as necessary
const {completeRide} = require('../controllers/currentRide/completeRide'); // Adjust the path as necessary
// Route to get current ride information
// GET /api/rides/current/:confirmRideId/:profileId
router.get('/current/:confirmRideId/:profileId', getCurrentRideInfo);

// Route to complete a ride
// POST /api/rides/complete
router.post('/complete', completeRide);

module.exports = router;
