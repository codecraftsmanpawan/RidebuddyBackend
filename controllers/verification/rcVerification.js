const RcVerification = require('../../models/RcVerification');
const Profile = require('../../models/Profile');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});

const upload = multer({ storage });

const crypto = require('crypto'); // Add crypto for generating random values

// Utility function to generate an 8-digit xRequestId
const generateXRequestId = () => {
  return crypto.randomInt(10000000, 100000000).toString();
};

const verifyRC = async (req, res) => {
  // Extract the x-request-id, vehicleId, and profileId from the request body
  let { xRequestId, vehicleId, profileId, vehicle_color, vehicle_fuel_type } = req.body;

  // Generate xRequestId if not provided
  if (!xRequestId) {
    xRequestId = generateXRequestId();
  }

  // Validate input
  if (!vehicleId || !profileId) {
    return res.status(400).json({
      message: 'vehicleId and profileId are required.'
    });
  }

  try {
    // Define the options for the API request
    const options = {
      method: 'POST',
      url: 'https://uat.apiclub.in/api/v1/rc_info',
      headers: {
        accept: 'application/json',
        'x-request-id': xRequestId,
        Referer: 'docs.apiclub.in',
        'content-type': 'application/json',
        'x-api-key': 'apclb_wMttXrEyW3xA0dul9FsuAMu41f32119e'
      },
      data: { vehicleId }
    };

    // Make the API request
    const response = await axios.request(options);

    // Log the response data (for debugging)
    console.log('API Response:', response.data);

    // Prepare the data to save in MongoDB
    const rcVerificationData = {
      code: response.data.code,
      status: response.data.status,
      message: response.data.message,
      request_id: response.data.request_id,
      response: {
        license_plate: response.data.response.license_plate,
        owner_name: response.data.response.owner_name,
        is_financed: response.data.response.is_financed || '',
        financer: response.data.response.financer || '',
        insurance_company: response.data.response.insurance_company,
        insurance_policy: response.data.response.insurance_policy || '',
        insurance_expiry: response.data.response.insurance_expiry ? new Date(response.data.response.insurance_expiry) : null,
        class: response.data.response.class,
        registration_date: response.data.response.registration_date ? new Date(response.data.response.registration_date) : null,
        vehicle_age: response.data.response.vehicle_age,
        pucc_upto: response.data.response.pucc_upto ? new Date(response.data.response.pucc_upto) : null,
        pucc_number: response.data.response.pucc_number || '',
        chassis_number: response.data.response.chassis_number,
        engine_number: response.data.response.engine_number,
        fuel_type: response.data.response.fuel_type, 
        brand_name: response.data.response.brand_name,
        brand_model: response.data.response.brand_model,
        cubic_capacity: response.data.response.cubic_capacity,
        gross_weight: response.data.response.gross_weight,
        cylinders: response.data.response.cylinders,
        color: response.data.response.color,
        norms: response.data.response.norms || '',
        noc_details: response.data.response.noc_details || '',
        seating_capacity: response.data.response.seating_capacity,
        owner_count: response.data.response.owner_count,
        tax_upto: response.data.response.tax_upto ? new Date(response.data.response.tax_upto) : null,
        tax_paid_upto: response.data.response.tax_paid_upto ? new Date(response.data.response.tax_paid_upto) : null,
        permit_number: response.data.response.permit_number || '',
        permit_issue_date: response.data.response.permit_issue_date ? new Date(response.data.response.permit_issue_date) : null,
        permit_valid_from: response.data.response.permit_valid_from ? new Date(response.data.response.permit_valid_from) : null,
        permit_valid_upto: response.data.response.permit_valid_upto ? new Date(response.data.response.permit_valid_upto) : null,
        permit_type: response.data.response.permit_type || '',
        national_permit_number: response.data.response.national_permit_number || '',
        national_permit_upto: response.data.response.national_permit_upto ? new Date(response.data.response.national_permit_upto) : null,
        national_permit_issued_by: response.data.response.national_permit_issued_by || '',
        rc_status: response.data.response.rc_status,
        vehicle_color: vehicle_color || '', // Added vehicle_color field
        vehicle_fuel_type: vehicle_fuel_type || '', // Added vehicle_fuel_type field
        vehicle_image: req.file ? req.file.path : '', // Vehicle image
      },
      profile: profileId,
      verified_at: new Date()
    };

    // Check if the record with the same request_id already exists
    const existingRecord = await RcVerification.findOne({ request_id: response.data.request_id });

    if (existingRecord) {
      // Record already exists, return a message indicating this
      return res.status(200).json({
        message: 'Record already verified'
      });
    }

    // Save the data to MongoDB
    const rcVerification = new RcVerification(rcVerificationData);
    await rcVerification.save();

    // Update the Profile with the new RcVerification
    await Profile.findByIdAndUpdate(
      profileId,
      { $push: { rcVerifications: rcVerification._id } },
      { new: true, useFindAndModify: false }
    );

    // Send only the success message to the client
    res.status(200).json({
      message: 'RC verification successful'
    });
  } catch (error) {
    // Handle errors and send an appropriate response to the client
    console.error('Error verifying RC:', error);
    if (error.response) {
      res.status(error.response.status).json({
        message: error.response.data.message || 'An error occurred while verifying RC.',
        error: error.response.data
      });
    } else if (error.name === 'MongoServerError') {
      if (error.message.includes('license_plate')) {
        res.status(409).json({
          message: 'Duplicate license plate detected.',
          error: error.message
        });
      } else if (error.message.includes('request_id')) {
        res.status(200).json({
          message: 'Record already verified'
        });
      } else {
        res.status(500).json({
          message: 'An error occurred while verifying RC.',
          error: error.message
        });
      }
    } else {
      res.status(500).json({
        message: 'An error occurred while verifying RC.',
        error: error.message
      });
    }
  }
};

// Define the controller function
const deleteRC = async (req, res) => {
  // Extract the rcVerificationId and profileId from the request parameters or body
  const { rcVerificationId, profileId } = req.params; // or req.body if you prefer

  // Validate input
  if (!rcVerificationId || !profileId) {
    return res.status(400).json({
      message: 'rcVerificationId and profileId are required.'
    });
  }

  try {
    // Find and delete the RcVerification record
    const rcVerification = await RcVerification.findByIdAndDelete(rcVerificationId);

    if (!rcVerification) {
      return res.status(404).json({
        message: 'RC verification record not found.'
      });
    }

    // Remove the reference to the deleted RcVerification from the Profile
    await Profile.findByIdAndUpdate(
      profileId,
      { $pull: { rcVerifications: rcVerificationId } },
      { new: true, useFindAndModify: false }
    );

    // Send success response
    res.status(200).json({
      message: 'RC verification record deleted successfully'
    });
  } catch (error) {
    // Handle errors and send an appropriate response to the client
    console.error('Error deleting RC verification record:', error);
    if (error.name === 'CastError') {
      // Handle invalid ObjectId error
      res.status(400).json({
        message: 'Invalid ID format.',
        error: error.message
      });
    } else {
      // Handle other errors
      res.status(500).json({
        message: 'An error occurred while deleting RC verification record.',
        error: error.message
      });
    }
  }
};

// Controller to get all RC verifications for a profile
const getRcVerificationsByProfile = async (req, res) => {
  try {
    // Extract profileId from the request params
    const { profileId } = req.params;

    // Check if the profile exists
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found'
      });
    }

    // Find all RcVerification records associated with the profileId and select specific fields
    const rcVerifications = await RcVerification.find({ profile: profileId }, 
      'response.license_plate response.owner_name response.rc_status response.vehicle_color response.fuel_type response.vehicle_image response.seating_capacity response.brand_name response.brand_model'
    );

    // If no verifications found
    if (!rcVerifications || rcVerifications.length === 0) {
      return res.status(404).json({
        message: 'No RC verifications found for this profile'
      });
    }

    // Return only the selected RC verifications data
    res.status(200).json({
      message: 'RC verifications retrieved successfully',
      data: rcVerifications.map(rc => ({
        license_plate: rc.response.license_plate,
        owner_name: rc.response.owner_name,
        rc_status: rc.response.rc_status,
        vehicle_color: rc.response.vehicle_color,
        fuel_type: rc.response.fuel_type,
        vehicle_image: rc.response.vehicle_image,
        seating_capacity: rc.response.seating_capacity,
        brand_name: rc.response.brand_name,
        brand_model: rc.response.brand_model
      }))
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching RC verifications:', error);
    res.status(500).json({
      message: 'An error occurred while fetching RC verifications',
      error: error.message
    });
  }
};

module.exports = { getRcVerificationsByProfile };


module.exports = { verifyRC,upload, deleteRC, getRcVerificationsByProfile };
