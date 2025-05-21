// server/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import propertiesRoutes from './routes/properties.js';

// Initialize dotenv
dotenv.config();

// Get dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve the images directory
app.use('/images', express.static(path.join(__dirname, 'server', 'public', 'images')));

// Routes
app.use('/api/properties', propertiesRoutes);

// ===== DEBUGGING MIDDLEWARE =====
// Add this temporarily to debug image requests
app.use((req, res, next) => {
  if (req.path.includes('/images/')) {
    console.log('Image request received:', req.path);
    
    // Check if file exists
    const imagePath = path.join(__dirname, 'public', req.path);
    
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
