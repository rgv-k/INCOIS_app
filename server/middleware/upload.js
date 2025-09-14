const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Updated upload middleware for file handling
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {

  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
  

  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  

  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and video files are allowed!'), false);
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 90 * 1024 * 1024 } // 90MB file size limit
});

module.exports = upload;