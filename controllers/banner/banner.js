const Banner = require('../../models/Banner');
const path = require('path');

// Function to add a new banner
exports.addBanner = async (req, res) => {
  try {
    // Destructure the required fields from req.body
    const { bannerLink, bannerType, bannerPosition } = req.body;

    // Ensure the file upload is handled by Multer and available in req.file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bannerImage = req.file.path; // Multer saves file to this path

    // Create a new Banner instance
    const newBanner = new Banner({
      bannerImage,
      bannerLink,
      bannerType,
      bannerPosition,
      createdAt: new Date() // Optional: Add created date
    });

    // Save the new banner to the database
    await newBanner.save();

    // Respond with the newly created banner
    res.status(201).json(newBanner);
  } catch (err) {
    // Handle and respond to errors
    res.status(500).json({ error: err.message });
  }
};

// Function to get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to get a specific banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to update a banner by ID
exports.updateBannerById = async (req, res) => {
  try {
    const { bannerLink, bannerType, bannerPosition } = req.body;
    const bannerImage = req.file ? req.file.path : undefined; // Multer saves file to this path

    const updateData = {
      bannerLink,
      bannerType,
      bannerPosition,
      ...(bannerImage && { bannerImage }), // Only add bannerImage if it exists
    };

    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedBanner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json(updatedBanner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to delete a banner by ID
exports.deleteBannerById = async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};