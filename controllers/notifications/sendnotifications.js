const admin = require('../../firebase/notify');
const Notification = require('../../models/notifications');

const sendNotification = async ({ token, userId, title, body, actions, navigation }) => {
  try {
    // Create a notification object in the database
    const notification = new Notification({

      userId: userId,
      title: title || '',
      body: body || '',
      data: { navigationId: navigation || '' }, // Fixed issue here
      actions: actions || []
    });
    await notification.save();

    // Build the message to send via Firebase
    const message = {
      token: token,
      notification: {
        title: title || '',
        body: body || ''
      },
      data: {
        navigationId: navigation || '' // Include navigationId in data
      }
    };

    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification');
  }
};

module.exports = { sendNotification };
