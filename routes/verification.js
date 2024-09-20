const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Import individual controllers
const { performVerification } = require('../controllers/verification/performVerification');
const { getVerificationDetails } = require('../controllers/verification/getVerification');
const { sendAadharOtp, verifyAadharOtp, deleteAadharVerification } = require('../controllers/verification/aadharVerification');
const { verifyRC, upload, deleteRC, getRcVerificationsByProfile } = require('../controllers/verification/rcVerification');
const { selfieVerification, deleteSelfieVerification } = require('../controllers/verification/selfieVerification');
const { DLverification, deleteDLVerification, getDLVerificationByProfileId } = require('../controllers/verification/dLVerification');

// Define routes for verification functionality
router.post('/verify', authenticateToken, performVerification); 
router.get('/verification/:verificationId', authenticateToken, getVerificationDetails); 

// POST route to send Aadhaar OTP
router.post('/aadhar-verification/send-otp',authenticateToken, sendAadharOtp);
// POST route to verify Aadhaar OTP
router.post('/aadhar-verification/verify-otp',authenticateToken, verifyAadharOtp);
// Route to delete an Aadhaar verification record by verificationId and userId
router.delete('/aadhar-verification/:adharId/profile/:profileId',authenticateToken, deleteAadharVerification);

// Define the route for RC verification
router.post('/rc-verification', upload.single('vehicle_image'),authenticateToken, verifyRC);
// Route to get all RC verifications by profile ID
router.get('/rc-verifications/:profileId',authenticateToken, getRcVerificationsByProfile);
// Route to delete an RC verification record
router.delete('/rc-verification/:rcVerificationId/profile/:profileId',authenticateToken, deleteRC);

// Define the route for selfie verification
router.post('/selfie-verification',authenticateToken, selfieVerification);
// Define route for deleting selfie verification
router.delete('/selfie-verification/:selfieVerificationId/profile/:profileId',authenticateToken, deleteSelfieVerification);

// POST route for creating a new DL verification
router.post('/dl-verification',authenticateToken, DLverification);
// Route to get DLVerification by profile ID
router.get('/dl-verification/:profileId',authenticateToken, getDLVerificationByProfileId);
// Define route for deleting DL verification
router.delete('/dl-verification/:dlVerificationId/profile/:profileId',authenticateToken, deleteDLVerification);

module.exports = router;
