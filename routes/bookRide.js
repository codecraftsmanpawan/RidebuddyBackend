const express = require('express');
const router = express.Router();
// Import individual controllers
// const {createOrUpdateCurrentHolding} = require('../controllers/currentHolding');
const { createBookingRequest } = require('../controllers/bookRide/createBooking');
const {handleDriverAction}= require('../controllers/bookRide/requestAction');
 const { getAllRides } = require('../controllers/bookRide/getAllBookings');
const { getRideOfferById } = require('../controllers/bookRide/getBookingById');
const { updateBooking } = require('../controllers/bookRide/updateBooking');
const { cancelBooking } = require('../controllers/bookRide/bookingAction');
// const {confirmBooking}= require('../controllers/bookRide/confirmBoking');
const {getRequest}= require('../controllers/bookRide/getRequest');
const { cancelConfirmedRide, cancelRequestBooking,createOrUpdateCurrentHolding, getBookingDetailsById  } = require('../controllers/bookRide/cancleBooking');  // Import your new functions

router.post('/requestBooking', createBookingRequest); // Create a new ride booking
router.patch('/getAllRides', getAllRides);
router.get('/booking/:id', getRideOfferById);  // Specific ride booking by ID
router.put('/booking/:id', updateBooking);  // Update a ride booking by ID
router.delete('/booking/:id', cancelBooking);  // Cancel a ride booking by ID
router.post('/booking/cancelConfirmedRide', cancelConfirmedRide); // Cancel a confirmed ride
router.post('/booking/cancelRequestBooking', cancelRequestBooking);
router.post('/current-holding', createOrUpdateCurrentHolding);
router.get('/bookings/:bookingId', getBookingDetailsById);
router.post('/booking/action', handleDriverAction);
router.get('/booking/request/:bookingId', getRequest);
router.post('/booking/confirm', async (req, res) => {
    try {
        const bookingDetails = req.body;
        const confirmedRide = await confirmBooking(bookingDetails);
        res.status(200).json(confirmedRide);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 