const mongoose = require('mongoose');
const axios = require('axios');
const DLVerification = require('../../models/DLVerification'); 
const Profile = require('../../models/Profile');
const crypto = require('crypto');

// Utility function to generate an 8-digit xRequestId
const generateXRequestId = () => {
  return crypto.randomInt(10000000, 100000000).toString();
};

const DLverification = async (req, res) => {
  let { dl_no, dob, xRequestId, profileId } = req.body;

  // Generate xRequestId if not provided
  if (!xRequestId) {
    xRequestId = generateXRequestId();
  }

  // Validate input
  if (!dl_no || !dob || !xRequestId || !profileId) {
    return res.status(400).json({
      message: 'dl_no, dob, xRequestId, and profileId are required.'
    });
  }

  // Validate profileId
  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    return res.status(400).json({
      message: 'Invalid profile ID format.'
    });
  }

  try {
    // Define the options for the API request
    const options = {
      method: 'POST',
      url: 'https://uat.apiclub.in/api/v1/fetch_dl',
      headers: {
        accept: 'application/json',
        'x-request-id': xRequestId,
        Referer: 'docs.apiclub.in',
        'content-type': 'application/json',
        'x-api-key': 'apclb_wMttXrEyW3xA0dul9FsuAMu41f32119e'
      },
      data: { dl_no, dob }
    };

    // Make the API request
    const response = await axios.request(options);

    // Extract relevant data from the API response
    const { code, status, message, request_id, response: apiResponse } = response.data;

    // Find the profile by ID
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found.'
      });
    }

    // Check if a DLVerification entry with the same dl_no and profileId already exists
    let existingVerification = await DLVerification.findOne({ 
      'response.license_number': dl_no, 
      profile: profile._id 
    });

    if (existingVerification) {
      return res.status(400).json({
        message: 'Driving license has already been verified for this profile.'
      });
    }

    // Check if a DLVerification entry with the same request_id already exists
    let dlVerification = await DLVerification.findOne({ request_id });

    if (dlVerification) {
      // Update the existing entry
      dlVerification.code = code;
      dlVerification.status = status;
      dlVerification.message = message;
      dlVerification.response = apiResponse;
      dlVerification.profile = profile._id; // Update the profile reference
      dlVerification.verified_at = Date.now(); // Update the timestamp

      await dlVerification.save();

      return res.status(200).json({
        message: 'Driving license verification updated successfully'
      });
    } else {
      // Create a new DLVerification entry
      dlVerification = new DLVerification({
        code,
        status,
        message,
        request_id,
        response: apiResponse,
        profile: profile._id
      });

      await dlVerification.save();

      // Update the profile with the new DLVerification reference
      profile.dlVerification = dlVerification._id;
      await profile.save();

      return res.status(200).json({
        message: 'Driving license verification created successfully'
      });
    }
  } catch (error) {
    console.error('Error during DL verification:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Verification request already exists.'
      });
    } else if (error.name === 'CastError' && error.path === '_id') {
      return res.status(400).json({
        message: 'Invalid ID format.'
      });
    } else if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.message || 'An error occurred while fetching driving license data.'
      });
    } else {
      return res.status(500).json({
        message: 'An error occurred while fetching driving license data.'
      });
    }
  }
};

// Define the controller function for deleting a DLVerification record
const deleteDLVerification = async (req, res) => {
  const { dlVerificationId, profileId } = req.params; // Extract ids from the request parameters

  // Validate input
  if (!mongoose.Types.ObjectId.isValid(dlVerificationId) || !mongoose.Types.ObjectId.isValid(profileId)) {
    return res.status(400).json({
      message: 'Invalid DL verification ID or profile ID format.'
    });
  }

  try {
    // Find and delete the DLVerification record
    const dlVerification = await DLVerification.findByIdAndDelete(dlVerificationId);

    if (!dlVerification) {
      return res.status(404).json({
        message: 'DL verification record not found.'
      });
    }

    // Find the profile and update it
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found.'
      });
    }

    // Remove the reference to the deleted DLVerification from the profile
    profile.dlVerification = undefined;
    await profile.save();

    // Send success response
    res.status(200).json({
      message: 'DL verification record Removed successfully.'
    });
  } catch (error) {
    console.error('Error deleting DL verification record:', error);

    if (error.name === 'CastError' && error.path === '_id') {
      // Handle invalid ObjectId error
      res.status(400).json({
        message: 'Invalid ID format.',
        error: error.message
      });
    } else {
      // Handle other errors
      res.status(500).json({
        message: 'An error occurred while deleting DL verification record.',
        error: error.message
      });
    }
  }
};


const getDLVerificationByProfileId = async (req, res) => {
  try {
    // Extract profileId from request parameters
    const profileId = req.params.profileId;

    // Validate profileId format (optional)
    if (!profileId) {
      return res.status(400).json({ message: 'Profile ID is required' });
    }

    // Find the DLVerification entry by profile ID
    const dlVerification = await DLVerification.findOne({ profile: profileId });

    // Check if DLVerification entry exists
    if (!dlVerification) {
      return res.status(404).json({ message: 'DLVerification record not found' });
    }

    // Return the found record
    res.status(200).json(dlVerification);
  } catch (error) {
    // Log the error and send a 500 status response
    console.error('Error fetching DLVerification record:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = { DLverification, deleteDLVerification, getDLVerificationByProfileId };
