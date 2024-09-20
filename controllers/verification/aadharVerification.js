const mongoose = require('mongoose');
const axios = require('axios');
const AadharVerification = require('../../models/AdharVerification'); 
const Profile = require('../../models/Profile'); 


// Utility function to generate an 8-digit random number
const generateRequestId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const sendAadharOtp = async (req, res) => {
  const { aadhaar_no } = req.body;

  // Generate a new request ID
  const request_id = generateRequestId();

  // Validate input
  if (!aadhaar_no) {
    return res.status(400).json({ message: 'Aadhaar number is required', request_id });
  }

  const options = {
    method: 'POST',
    url: 'https://uat.apiclub.in/api/v1/aadhaar_v2/send_otp',
    headers: {
      accept: 'application/json',
      'x-request-id': request_id, 
      Referer: 'docs.apiclub.in',
      'content-type': 'application/json',
      'x-api-key': 'apclb_wMttXrEyW3xA0dul9FsuAMu41f32119e'
    },
    data: { aadhaar_no }
  };

  try {
    const response = await axios.request(options);
    // Include the generated request ID in the response
    return res.status(response.status).json({
      ...response.data,
      request_id
    });
  } catch (error) {
    console.error('Error sending Aadhaar OTP:', error);
    return res.status(error.response ? error.response.status : 500).json({
      message: 'Failed to send OTP',
      error: error.message,
      request_id 
    });
  }
};


// Utility function to check if a value is a valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const verifyAadharOtp = async (req, res) => {
  const { ref_id, otp, request_id, profileId } = req.body;

  // Log the incoming request data
  console.log('Incoming request data:', { ref_id, otp, request_id, profileId });

  // Validate input
  if (!ref_id || !otp || !request_id || !profileId) {
    console.log('Validation error: Missing required fields');
    return res.status(400).json({ message: 'Reference ID, OTP, request ID, and profile ID are required' });
  }

  // Check if profileId is a valid ObjectId
  if (!isValidObjectId(profileId)) {
    console.log('Validation error: Invalid profile ID');
    return res.status(400).json({ message: 'Invalid profile ID' });
  }

  const options = {
    method: 'POST',
    url: 'https://uat.apiclub.in/api/v1/aadhaar_v2/submit_otp',
    headers: {
      accept: 'application/json',
      'x-request-id': request_id,
      Referer: 'docs.apiclub.in',
      'content-type': 'application/json',
      'x-api-key': 'apclb_wMttXrEyW3xA0dul9FsuAMu41f32119e'
    },
    data: { ref_id, otp }
  };

  try {
    // Log the request options
    console.log('API request options:', options);

    const response = await axios.request(options);

    // Log the API response
    console.log('API response:', response.data);

    // Check if the response is successful
    if (response.data.code === 200 && response.data.status === 'success') {
      // Prepare the data to save
      const verificationData = {
        code: response.data.code,
        status: response.data.status,
        message: response.data.message,
        request_id: response.data.request_id,
        response: {
          request_id: response.data.response.request_id,
          aadhar: response.data.response.aadhar,
          name: response.data.response.name,
          care: response.data.response.care,
          dob: new Date(response.data.response.dob),
          gender: response.data.response.gender,
          address: response.data.response.address,
          image: response.data.response.image,
          share_code: response.data.response.share_code,
          zip_file: response.data.response.zip_file
        },
        profile: profileId, // Use profileId from request
        data: response.data.request_id, // Store request_id directly
        verified_at: new Date()
      };

      // Log the verification data to be saved
      console.log('Data to be saved:', verificationData);

      // Check if a record with the same profile or data already exists
      const existingVerification = await AadharVerification.findOne({
        $or: [{ profile: verificationData.profile }, { data: verificationData.data }]
      });

      if (existingVerification) {
        console.log('Profile already verified:', existingVerification);
        return res.status(400).json({ message: 'Profile already verified' });
      }

      // Create and save the new AadharVerification document
      const newVerification = new AadharVerification(verificationData);
      await newVerification.save();

      // Update Profile with the new verification reference
      await Profile.findByIdAndUpdate(profileId, {
        aadharVerification: newVerification._id
      });

      // Respond to the client with success message only
      console.log('Verification saved and profile updated successfully:', newVerification);
      return res.status(200).json({ message: 'Aadhaar verification successful' });
    } else {
      console.log('OTP verification failed:', response.data);
      return res.status(400).json({ message: 'OTP verification failed', details: response.data });
    }
  } catch (error) {
    console.error('Error verifying Aadhaar OTP:', error);
    // Log the error response if available
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    return res.status(error.response ? error.response.status : 500).json({
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
};


// Define the controller function
const deleteAadharVerification = async (req, res) => {
    const { adharId, profileId } = req.params; // Extract adharId and profileId from the request parameters

    // Validate adharId and profileId
    if (!mongoose.Types.ObjectId.isValid(adharId)) {
        return res.status(400).json({ message: 'Invalid Aadhaar verification ID format.' });
    }

    if (!mongoose.Types.ObjectId.isValid(profileId)) {
        return res.status(400).json({ message: 'Invalid profile ID format.' });
    }

    try {
        // Find the profile associated with the profileId
        const profile = await Profile.findById(profileId);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found.' });
        }

        // Check if the profile has the Aadhaar verification record
        if (profile.aadharVerification.toString() !== adharId) {
            return res.status(404).json({ message: 'Aadhaar verification record does not match profile.' });
        }

        // Find and delete the Aadhaar verification record
        await AadharVerification.findByIdAndDelete(adharId);

        // Remove the Aadhaar verification reference from the profile
        profile.aadharVerification = null;
        await profile.save();

        return res.status(200).json({ message: 'Aadhaar verification Remove successfully' });
    } catch (error) {
        console.error('Error deleting Aadhaar verification:', error);
        return res.status(500).json({ message: 'Server error while deleting Aadhaar verification.', error: error.message });
    }
};


module.exports =


module.exports = { sendAadharOtp, verifyAadharOtp, deleteAadharVerification };
