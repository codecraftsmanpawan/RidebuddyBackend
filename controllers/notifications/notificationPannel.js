const Notification = require('../../models/notifications');

const getUserNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find notifications for the user
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Notifications retrieved successfully',
      notifications
    });
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    res.status(500).json({ message: 'Failed to retrieve notifications', error: error.message });
  }
};

module.exports = { getUserNotifications };
