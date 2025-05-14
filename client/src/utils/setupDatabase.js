// utils/setupDatabase.js
import pool from './db';
import fs from 'fs';
import path from 'path';

/**
 * Setup database tables and seed initial data
 */
async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Read the SQL file content
    const sqlFilePath = path.join(__dirname, '../data/property_schema.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = sql
      .replace(/(\r\n|\n|\r)/gm, ' ') // Remove newlines
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .split(';') // Split statements on semicolons
      .filter(statement => statement.trim().length > 0); // Remove empty statements
    
    // Execute each statement
    for (const statement of statements) {
      await pool.query(statement);
      console.log('Executed SQL statement');
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up the database:', error);
    throw error;
  }
}

/**
 * Check if the properties table exists
 */
async function checkDatabaseSetup() {
  try {
    // Check if the properties table exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'properties'
      );
    `);
    
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking database setup:', error);
    return false;
  }
}

/**
 * Initialize the database (create tables and seed data if needed)
 */
export async function initializeDatabase() {
  try {
    const isSetup = await checkDatabaseSetup();
    
    if (!isSetup) {
      console.log('Database not set up. Setting up now...');
      await setupDatabase();
    } else {
      console.log('Database already set up');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

export default initializeDatabase;