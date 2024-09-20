const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig.js');
const authenticateToken = require('../middleware/authenticateToken.js');

// Importing individual controller
const { sendOtp } = require('../controllers/register/sendOtp.js');
const { verifyOtp } = require('../controllers/register/verifyOtp.js');
const { createProfile } = require('../controllers/register/createProfile.js');
const { updateProfile } = require('../controllers/register/updateProfile.js');
const { getProfile } = require('../controllers/register/getProfile.js');

// Define routes for authentication functionality
router.post('/send-otp', sendOtp); // Route to send OTP
router.post('/verify-otp', verifyOtp); // Route to verify OTP
router.post('/create-profile', createProfile); // Route to create profile
router.post('/get-profile', authenticateToken, getProfile); // Route to get profile
router.post('/update/:userId', authenticateToken, upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]), updateProfile); // Route to update profile

module.exports = router;