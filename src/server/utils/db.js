// utils/db.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database configuration with sensible defaults
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Zhao@2025!',
  port: parseInt(process.env.DB_PORT || '5432'),
  // Additional configuration for better performance and reliability
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

// Create the connection pool
const pool = new Pool(dbConfig);

// Event handlers for the pool
pool.on('connect', (client) => {
  console.log('New client connected to database');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // Don't crash the server on connection errors
  // The pool will create a new client if needed
});

// Enhanced database interface with utility methods
const db = {
  /**
   * Raw query method for executing SQL queries
   * @param {string} text - SQL query text
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} - Query result
   */
  query: async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Query error', { text, error });
      throw error;
    }
  },

  /**
   * Get a single row by ID
   * @param {string} table - Table name
   * @param {string|number} id - ID to look for
   * @param {string} idColumn - Column name for ID (defaults to 'id')
   * @returns {Promise<Object>} - Single row or null
   */
  getById: async (table, id, idColumn = 'id') => {
    const query = `SELECT * FROM ${table} WHERE ${idColumn} = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  /**
   * Insert a new record
   * @param {string} table - Table name
   * @param {Object} data - Data to insert
   * @returns {Promise<Object>} - Inserted row
   */
  insert: async (table, data) => {
    const columns = Object.keys(data);
    const values = Object.values(data);
    
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const columnNames = columns.join(', ');
    
    const query = `
      INSERT INTO ${table} (${columnNames}) 
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  /**
   * Update an existing record
   * @param {string} table - Table name
   * @param {string|number} id - ID of record to update
   * @param {Object} data - Data to update
   * @param {string} idColumn - Column name for ID (defaults to 'id')
   * @returns {Promise<Object>} - Updated row
   */
  update: async (table, id, data, idColumn = 'id') => {
    const columns = Object.keys(data);
    const values = Object.values(data);
    
    const setClauses = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
    
    const query = `
      UPDATE ${table} 
      SET ${setClauses} 
      WHERE ${idColumn} = $${values.length + 1}
      RETURNING *
    `;
    
    const result = await db.query(query, [...values, id]);
    return result.rows[0];
  },

  /**
   * Delete a record
   * @param {string} table - Table name
   * @param {string|number} id - ID of record to delete
   * @param {string} idColumn - Column name for ID (defaults to 'id')
   * @returns {Promise<Object>} - Deleted row
   */
  delete: async (table, id, idColumn = 'id') => {
    const query = `
      DELETE FROM ${table}
      WHERE ${idColumn} = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Get multiple records with optional filtering
   * @param {string} table - Table name
   * @param {Object} filters - Filter conditions
   * @param {string} orderBy - Order by clause
   * @param {number} limit - Limit number of results
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} - Array of rows
   */
  getMany: async (table, filters = {}, orderBy = '', limit = 100, offset = 0) => {
    const conditions = [];
    const values = [];
    let paramIndex = 1;
    
    // Build WHERE clause from filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        conditions.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });
    
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';
    
    const orderByClause = orderBy ? `ORDER BY ${orderBy}` : '';
    
    const query = `
      SELECT * FROM ${table}
      ${whereClause}
      ${orderByClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const result = await db.query(query, [...values, limit, offset]);
    return result.rows;
  },

  /**
   * Count records with optional filtering
   * @param {string} table - Table name
   * @param {Object} filters - Filter conditions
   * @returns {Promise<number>} - Count of matching rows
   */
  count: async (table, filters = {}) => {
    const conditions = [];
    const values = [];
    let paramIndex = 1;
    
    // Build WHERE clause from filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        conditions.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });
    
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';
    
    const query = `
      SELECT COUNT(*) as count FROM ${table}
      ${whereClause}
    `;
    
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  },

  /**
   * Transaction helper
   * @param {Function} callback - Function that receives a client and executes queries
   * @returns {Promise<any>} - Result of the callback
   */
  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Get the connection pool
   * @returns {Pool} - PostgreSQL connection pool
   */
  getPool: () => pool,

  /**
   * Close the pool and exit
   */
  close: async () => {
    await pool.end();
    console.log('Database connection pool closed');
  }
};

// Test database connection
db.query('SELECT NOW()')
  .then(res => {
    console.log('Database connected successfully at', res.rows[0].now);
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Handle application shutdown gracefully
process.on('SIGINT', async () => {
  console.log('Closing database connections...');
  await db.close();
  process.exit(0);
});

export default db;