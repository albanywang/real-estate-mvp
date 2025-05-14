// server/setupDatabase.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function setupDatabase() {
  try {
    // Read schema
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'db', 'schema.sql'),
      'utf8'
    );
    
    // Run schema creation
    await pool.query(schemaSQL);
    console.log('Database schema created successfully');
    
    // Read seed data
    const seedSQL = fs.readFileSync(
      path.join(__dirname, 'db', 'seeds', 'seed.sql'),
      'utf8'
    );
    
    // Insert seed data
    await pool.query(seedSQL);
    console.log('Seed data inserted successfully');
    
    await pool.end();
    
    console.log('Database setup completed');
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}

setupDatabase();