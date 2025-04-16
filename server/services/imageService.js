const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

module.exports = {
  // Middleware for single image upload
  uploadSingle: upload.single('image'),
  
  // Middleware for multiple image upload
  uploadMultiple: upload.array('images', 10), // Max 10 images
  
  /**
   * Delete an image file
   * @param {string} filename - Name of the file to delete
   * @returns {Promise<boolean>} Success status
   */
  deleteImage: async (filename) => {
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, '../uploads', filename);
      
      fs.unlink(filePath, (err) => {
        if (err) {
          // If file doesn't exist, consider it already deleted
          if (err.code === 'ENOENT') {
            return resolve(true);
          }
          return reject(err);
        }
        
        resolve(true);
      });
    });
  },
  
  /**
   * Get public URL for an image
   * @param {string} filename - Image filename
   * @returns {string} Public URL
   */
  getImageUrl: (filename) => {
    // This would be replaced with your actual domain in production
    const baseUrl = process.env.API_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/${filename}`;
  }
};