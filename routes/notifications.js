const express = require('express');
const router = express.Router();
const { getUserNotifications } = require('../controllers/notifications/notificationPannel');

router.get('/notifications/:userId', getUserNotifications);

module.exports = router;
