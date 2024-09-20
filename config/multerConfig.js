const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to ensure directory exists or create it
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Configure multer storage to handle different destinations
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = '';
        if (file.fieldname === 'profilePicture') {
            uploadPath = path.join('uploads', 'profilepicture');
        } else if (file.fieldname === 'images') {
            uploadPath = path.join('uploads', 'userimages');
        } else {
            uploadPath = path.join('uploads', 'other');
        }
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

module.exports = upload;