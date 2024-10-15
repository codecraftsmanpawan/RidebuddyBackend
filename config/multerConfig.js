const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = '';
        if (file.fieldname === 'profilePicture') {
            uploadPath = path.join('uploads', 'profilepicture');
        } else if (file.fieldname === 'images') {
            uploadPath = path.join('uploads', 'Communityimages');
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

const upload = multer({
    storage: storage,
    limits: {
        files: 5,
        fileSize: 1024 * 1024 * 5
    }
});

module.exports = upload;