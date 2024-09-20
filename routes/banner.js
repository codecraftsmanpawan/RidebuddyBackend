const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bannerController = require('../controllers/banner/banner'); 


// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the directory exists
    cb(null, 'uploads/banner'); 
  },
  filename: (req, file, cb) => {
    // Create a unique filename for each upload
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to add a new banner
router.post('/addbanner', upload.single('bannerImage'), bannerController.addBanner);

// Route to get all banners
router.get('/get/banner', bannerController.getAllBanners);

// Route to get a specific banner by ID
router.get('/:id', bannerController.getBannerById);

// Route to update a banner by ID
router.put('/:id', upload.single('bannerImage'), bannerController.updateBannerById);

// Route to delete a banner by ID
router.delete('/:id', bannerController.deleteBannerById);


module.exports = router;