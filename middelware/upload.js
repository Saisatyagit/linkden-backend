const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Replace spaces with underscores to avoid issues
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + safeName);
  },
});

// File filter (allow images & videos)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'));
  }
};

// Initialize multer
const upload = multer({ storage, fileFilter });

// Middleware to resize images safely
const resizeImage = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const filePath = req.file.path;

    // Only resize if image
    if (req.file.mimetype.startsWith('image')) {
      const newFilePath = path.join(uploadDir, 'resized-' + req.file.filename);

      await sharp(filePath)
        .resize({ width: 800, height: 450, fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(newFilePath);

      // Delete original file safely (async)
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete original image:', err);
      });

      req.file.path = newFilePath;
    }

    next();
  } catch (error) {
    console.error('Image resize failed:', error);
    next(error);
  }
};

module.exports = { upload, resizeImage };
