// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve the public/images directory
//app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Explicitly serve the images directory
app.use('/images', express.static(path.join(__dirname, 'server', 'public', 'images')));

// Routes
const propertiesRoutes = require('./routes/properties');
app.use('/api/properties', propertiesRoutes);

// ===== DEBUGGING MIDDLEWARE =====
// Add this temporarily to debug image requests
app.use((req, res, next) => {
  if (req.path.includes('/images/')) {
    console.log('Image request received:', req.path);
    
    // Check if file exists
    const imagePath = path.join(__dirname, 'public', req.path);
    const fs = require('fs');
    
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`Image not found at ${imagePath}`);
        // Continue anyway to see the actual error
      } else {
        console.log(`Image found at ${imagePath}`);
      }
      next();
    });
  } else {
    next();
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});