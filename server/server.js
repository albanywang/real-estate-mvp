const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // For serving images

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get single property by ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Filter properties
app.post('/api/properties/filter', async (req, res) => {
  try {
    const { 
      minPrice, 
      maxPrice, 
      propertyType, 
      layout, 
      minArea, 
      maxArea 
    } = req.body;
    
    let query = 'SELECT * FROM properties WHERE 1=1';
    const values = [];
    let valueIndex = 1;
    
    if (minPrice) {
      query += ` AND price >= $${valueIndex}`;
      values.push(minPrice);
      valueIndex++;
    }
    
    if (maxPrice) {
      query += ` AND price <= $${valueIndex}`;
      values.push(maxPrice);
      valueIndex++;
    }
    
    if (propertyType) {
      query += ` AND property_type = $${valueIndex}`;
      values.push(propertyType);
      valueIndex++;
    }
    
    if (layout) {
      query += ` AND layout = $${valueIndex}`;
      values.push(layout);
      valueIndex++;
    }
    
    if (minArea) {
      query += ` AND area >= $${valueIndex}`;
      values.push(minArea);
      valueIndex++;
    }
    
    if (maxArea) {
      query += ` AND area <= $${valueIndex}`;
      values.push(maxArea);
      valueIndex++;
    }
    
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});