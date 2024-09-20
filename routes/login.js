const express = require('express');
const router = express.Router();

// Import individual controllers
const { login } = require('../controllers/login/sendOtp');
const { verifyOtp } = require('../controllers/login/verifyOtp');

// Routes for sending OTP and verifying OTP
router.post('/send-login-otp', login);  // Route to send OTP
router.post('/verify-login-otp', verifyOtp);  // Route to verify OTP

module.exports = router;