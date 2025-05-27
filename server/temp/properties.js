// server/routes/properties.js
import express from 'express';
import { Pool } from 'pg';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'property-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// GET all properties
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        title,
        price,
        pricePerSquareMeter,
        address,
        layout,
        area,
        floorInfo,
        structure,
        managementFee,
        areaOfUse,
        transportation,
        ST_AsGeoJSON(location)::jsonb AS location,
        propertyType,
        yearBuilt,
        balconyArea,
        totalUnits,
        repairReserveFund,
        landLeaseFee,
        rightFee,
        depositGuarantee,
        maintenanceFees,
        otherFees,
        bicycleParking,
        bikeStorage,
        siteArea,
        pets,
        landRights,
        managementForm,
        landLawNotification,
        currentSituation,
        extraditionPossibleDate,
        transactionMode,
        propertyNumber,
        informationReleaseDate,
        nextScheduledUpdateDate,
        remarks,
        evaluationCertificate,
        parking,
        kitchen,
        bathToilet,
        facilitiesServices,
        others,
        images,
        createdAt,
        updatedAt
      FROM properties 
      ORDER BY id DESC
    `);

    // Ensure location is null if missing
    const properties = result.rows.map(property => ({
      ...property,
      location: property.location || null
    }));

    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});


// GET a single property by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT * FROM properties 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Process the property to ensure location is formatted correctly
    const property = result.rows[0];
    
    // Handle location field
    if (property.location) {
      // If location is a PostgreSQL array string
      if (typeof property.location === 'string') {
        try {
          property.location = property.location.replace('{', '[').replace('}', ']');
          property.location = JSON.parse(property.location);
        } catch (e) {
          console.warn('Failed to parse location string:', property.location);
          property.location = null;
        }
      }
      
      // Ensure location values are numbers
      if (Array.isArray(property.location)) {
        property.location = property.location.map(val => 
          typeof val === 'string' ? parseFloat(val) : val
        );
      }
    }
    
    res.json(property);
  } catch (err) {
    console.error(`Error fetching property with ID ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// POST a new property
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const {
      title, price, address, layout, area, floorInfo, structure,
      managementFee, areaOfUse, transportation, propertyType, yearBuilt,
      lat, lng, // These would be sent separately in the form
      // Add other fields as needed
    } = req.body;
    
    // Convert and validate location data
    let location = null;
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      
      if (!isNaN(latitude) && !isNaN(longitude)) {
        location = [latitude, longitude];
      } else {
        return res.status(400).json({ error: 'Invalid location coordinates' });
      }
    }
    
    // Process uploaded images
    const images = req.files ? req.files.map(file => `/images/${file.filename}`) : [];
    
    // Insert property into database
    const result = await pool.query(`
      INSERT INTO properties (
        title, price, address, layout, area, floorInfo, structure,
        managementFee, areaOfUse, transportation, location, propertyType,
        yearBuilt, images
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) RETURNING *
    `, [
      title, 
      parseInt(price), 
      address, 
      layout, 
      parseFloat(area), 
      floorInfo, 
      structure,
      parseInt(managementFee), 
      areaOfUse, 
      transportation, 
      location ? location : null, // Store as PostgreSQL array
      propertyType, 
      yearBuilt,
      images
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Filter properties
router.post('/filter', async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      propertyType,
      layout,
      minArea,
      maxArea,
      yearBuilt
    } = req.body;
    
    let query = 'SELECT * FROM properties WHERE 1=1';
    const values = [];
    let paramIndex = 1;
    
    if (minPrice) {
      query += ` AND price >= ${paramIndex}`;
      values.push(parseInt(minPrice));
      paramIndex++;
    }
    
    if (maxPrice) {
      query += ` AND price <= ${paramIndex}`;
      values.push(parseInt(maxPrice));
      paramIndex++;
    }
    
    if (propertyType) {
      query += ` AND propertyType = ${paramIndex}`;
      values.push(propertyType);
      paramIndex++;
    }
    
    if (layout) {
      query += ` AND layout = ${paramIndex}`;
      values.push(layout);
      paramIndex++;
    }
    
    if (minArea) {
      query += ` AND area >= ${paramIndex}`;
      values.push(parseFloat(minArea));
      paramIndex++;
    }
    
    if (maxArea) {
      query += ` AND area <= ${paramIndex}`;
      values.push(parseFloat(maxArea));
      paramIndex++;
    }
    
    if (yearBuilt) {
      query += ` AND yearBuilt LIKE ${paramIndex}`;
      values.push(`%${yearBuilt}%`); // Using LIKE for partial match on year
      paramIndex++;
    }
    
    query += ' ORDER BY id DESC';
    
    const result = await pool.query(query, values);
    
    // Process location data as in the GET route
    const properties = result.rows.map(property => {
      let location = property.location;
      
      if (location) {
        if (typeof location === 'string') {
          try {
            location = location.replace('{', '[').replace('}', ']');
            location = JSON.parse(location);
          } catch (e) {
            location = null;
          }
        }
        
        if (Array.isArray(location)) {
          location = location.map(val => typeof val === 'string' ? parseFloat(val) : val);
        }
      }
      
      return {
        ...property,
        location
      };
    });
    
    res.json(properties);
  } catch (err) {
    console.error('Error filtering properties:', err);
    res.status(500).json({ error: 'Failed to filter properties' });
  }
});

export default router;