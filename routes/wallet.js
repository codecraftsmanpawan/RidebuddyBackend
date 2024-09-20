const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Import individual controllers
const getWalletDetails = require('../controllers/wallet/getWalletDetails');
const updateBalance = require('../controllers/wallet/updateBalance');
const addRewardsPoints = require('../controllers/wallet/addRewardsPoints');
const updateCarbonEmissionPoints = require('../controllers/wallet/updateCarbonEmissionPoints');
const { createOrder, verifyPayment } = require('../controllers/wallet/rechargeWallet');

// Define routes for wallet endpoints
router.get('/:userId', authenticateToken, getWalletDetails);  // Route to get wallet details for a specific user
router.put('/balance/:userId', authenticateToken, updateBalance);  // Route to update balance for a user
router.put('/rewards/:userId', authenticateToken, addRewardsPoints);  // Route to add rewards points for a user
router.put('/carbon/:userId', authenticateToken, updateCarbonEmissionPoints);  // Route to update carbon emission points

router.post('/createOrder', createOrder);

// Route to verify a payment
router.post('/verifyPayment', verifyPayment);

module.exports = router;