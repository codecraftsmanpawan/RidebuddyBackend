const mongoose = require('mongoose');
const axios = require('axios');
const crypto = require('crypto');
const SelfieVerification = require('../../models/SelfieVerification');
const Profile = require('../../models/Profile');

// Define the controller function
const selfieVerification = async (req, res) => {
  const { doc_img, selfie, profileId } = req.body;

  // Validate input
  if (!doc_img || !selfie) {
    return res.status(400).json({
      message: 'doc_img (Base64) and selfie (Base64) are required.'
    });
  }

  // Generate a random 8-digit request_id
  const xRequestId = crypto.randomBytes(4).toString('hex');

  // Check if the strings are valid Base64
  const isBase64 = (str) => {
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return base64Regex.test(str);
  };

  if (!isBase64(doc_img) || !isBase64(selfie)) {
    return res.status(400).json({
      message: 'doc_img and selfie must be valid Base64 encoded strings.'
    });
  }

  const options = {
    method: 'POST',
    url: 'https://uat.apiclub.in/api/v1/face_match',
    headers: {
      accept: 'application/json',
      'x-request-id': xRequestId,
      Referer: 'docs.apiclub.in',
      'content-type': 'application/json',
      'x-api-key': 'apclb_wMttXrEyW3xA0dul9FsuAMu41f32119e'
    },
    data: { doc_img, selfie }
  };

  try {
    const response = await axios.request(options);

    const { code, status, message, response: apiResponse } = response.data;

    // Create the selfieVerification document
    const selfieVerification = new SelfieVerification({
      code,
      status,
      message,
      request_id: xRequestId,
      response: apiResponse,
      profile: profileId ? mongoose.Types.ObjectId(profileId) : undefined,
      verified_selfie: selfie // assuming you want to store the selfie here
    });

    await selfieVerification.save();

    if (profileId) {
      const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

      if (!isValidObjectId(profileId)) {
        return res.status(400).json({
          message: 'Invalid profile ID format.'
        });
      }

      const profile = await Profile.findById(profileId);
      if (!profile) {
        return res.status(404).json({
          message: 'User not found.'
        });
      }

      if (profile.isVerified) {
        return res.status(400).json({
          message: 'Profile already verified.'
        });
      }

      profile.selfieVerification = selfieVerification._id;
      await profile.save();
    }

    res.status(200).json({
      message: 'Selfie verification successful',
      data: response.data
    });
  } catch (error) {
    console.error('Error during selfie verification:', error);
    res.status(500).json({
      message: 'An error occurred during selfie verification.',
      error: error.message || 'Unknown error'
    });
  }
};

// Define the controller function for deleting a SelfieVerification
const deleteSelfieVerification = async (req, res) => {
  // Extract selfieVerificationId and profileId from the request parameters
  const { selfieVerificationId, profileId } = req.params;

  // Validate selfieVerificationId
  if (!mongoose.Types.ObjectId.isValid(selfieVerificationId)) {
    return res.status(400).json({
      message: 'Invalid selfie verification ID format.'
    });
  }

  // Validate profileId
  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    return res.status(400).json({
      message: 'Invalid profile ID format.'
    });
  }

  try {
    // Find and delete the SelfieVerification document
    const selfieVerification = await SelfieVerification.findByIdAndDelete(selfieVerificationId);

    if (!selfieVerification) {
      return res.status(404).json({
        message: 'Selfie verification document not found.'
      });
    }

    // Find and update the associated Profile document
    const profile = await Profile.findById(profileId);
    if (profile) {
      // Remove the selfieVerification reference from the profile
      if (profile.selfieVerification && profile.selfieVerification.toString() === selfieVerificationId) {
        profile.selfieVerification = undefined;
        await profile.save();
      }
    } else {
      return res.status(404).json({
        message: 'Profile not found.'
      });
    }

    // Send a success response
    res.status(200).json({
      message: 'Selfie verification document successfully deleted.'
    });
  } catch (error) {
    // Handle errors and send an appropriate response to the client
    console.error('Error deleting SelfieVerification document:', error);

    if (error.name === 'CastError' && error.path === '_id') { // Invalid ObjectId
      res.status(400).json({
        message: 'Invalid ID format.',
        error: error.message
      });
    } else {
      res.status(500).json({
        message: 'An error occurred while deleting the selfie verification document.',
        error: error.message
      });
    }
  }
};


module.exports = { selfieVerification, deleteSelfieVerification };
