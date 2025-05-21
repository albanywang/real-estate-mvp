// server/setupDatabase.js
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    
    // Enable PostGIS and execute schema
    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    // Run schema creation
    await pool.query(schemaSQL);
    console.log('Database schema created successfully');
       
    await pool.end();
    
    console.log('Database setup completed');
  } catch (err) {
    console.error('Error setting up database:', err);
    throw error; // Rethrow for debugging
  } finally {
      await pool.end();
  }
}

setupDatabase().catch(() => process.exit(1));