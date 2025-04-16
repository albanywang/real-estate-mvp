const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Newly created user
   */
  static async create(userData) {
    const { email, password, first_name, last_name, phone } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name, phone, created_at;
    `;
    
    const values = [email, hashedPassword, first_name, last_name, phone];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    
    try {
      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User object
   */
  static async findById(id) {
    const query = `
      SELECT id, email, first_name, last_name, phone, created_at, updated_at 
      FROM users 
      WHERE id = $1
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  static async update(id, userData) {
    const { first_name, last_name, phone, password } = userData;
    
    let query, values;
    
    // If password is provided, update password too
    if (password) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      query = `
        UPDATE users 
        SET first_name = $1, last_name = $2, phone = $3, password_hash = $4, updated_at = NOW()
        WHERE id = $5
        RETURNING id, email, first_name, last_name, phone, created_at, updated_at;
      `;
      
      values = [first_name, last_name, phone, hashedPassword, id];
    } else {
      query = `
        UPDATE users 
        SET first_name = $1, last_name = $2, phone = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING id, email, first_name, last_name, phone, created_at, updated_at;
      `;
      
      values = [first_name, last_name, phone, id];
    }
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if password matches
   * @param {string} enteredPassword - Password to check
   * @param {string} hashedPassword - Stored hashed password
   * @returns {Promise<boolean>} Whether passwords match
   */
  static async comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  /**
   * Get saved properties for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of property IDs
   */
  static async getSavedProperties(userId) {
    const query = 'SELECT property_id FROM saved_properties WHERE user_id = $1';
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows.map(row => row.property_id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle saved property
   * @param {number} userId - User ID
   * @param {number} propertyId - Property ID
   * @returns {Promise<Object>} Result with saved status
   */
  static async toggleSavedProperty(userId, propertyId) {
    // First check if the property is already saved
    const checkQuery = 'SELECT * FROM saved_properties WHERE user_id = $1 AND property_id = $2';
    
    try {
      const checkResult = await db.query(checkQuery, [userId, propertyId]);
      
      // If property is already saved, remove it
      if (checkResult.rows.length > 0) {
        const deleteQuery = 'DELETE FROM saved_properties WHERE user_id = $1 AND property_id = $2';
        await db.query(deleteQuery, [userId, propertyId]);
        return { saved: false };
      }
      
      // Otherwise, save the property
      const insertQuery = 'INSERT INTO saved_properties (user_id, property_id) VALUES ($1, $2)';
      await db.query(insertQuery, [userId, propertyId]);
      return { saved: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;