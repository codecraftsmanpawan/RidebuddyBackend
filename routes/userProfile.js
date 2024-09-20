const express = require('express');
const router = express.Router();
const { getProfileByUserId } = require('../controllers/user/profileGet');
const authenticateToken = require('../middleware/authenticateToken.js');
const { uploadImage } = require('../controllers/user/imageController.js');

router.get('/profile/:userId',authenticateToken, getProfileByUserId);
// Route to upload image
router.post('/upload', uploadImage);
module.exports = router;
