const RequestBooking = require('../../models/RequestBooking'); // Adjust the path as necessary
const Profile = require('../../models/Profile'); // Adjust the path as necessary

// Route to get booking details by booking ID
const getRequest = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    console.log("bookingId", bookingId);

    // Find the booking request by ID
    const bookingRequest = await RequestBooking.findById(bookingId);
    console.log("bookingRequest", bookingRequest);

    if (!bookingRequest) {
      return res.status(404).json({ message: 'Booking request not found' });
    }

    // Find the user profile associated with the booking request
    const user = await Profile.findById(bookingRequest.userProfile);
    console.log("user", user);

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Respond with booking request and user profile details
    res.json({
      bookingRequest,
      userProfile: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getRequest
};
