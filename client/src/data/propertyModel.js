// data/propertyModel.js
import pool from '../utils/db';

/**
 * Property model class for handling property data interactions
 */
class PropertyModel {
  /**
   * Get all properties with optional filtering
   * @param {Object} filters - Object containing filter parameters
   * @returns {Promise<Array>} - Array of property objects
   */
  async getProperties(filters = {}) {
    try {
      const {
        title,
        minPrice,
        maxPrice,
        address,
        layout,
        minArea,
        maxArea,
        propertyType,
        petsAllowed,
        transportation,
        yearBuilt
      } = filters;

      // Parse boolean values
      const parsedPetsAllowed = petsAllowed !== undefined ? petsAllowed : null;
      
      const queryText = `
        SELECT * FROM search_properties(
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        );
      `;

      const queryValues = [
        title || null,
        minPrice ? parseFloat(minPrice) : null,
        maxPrice ? parseFloat(maxPrice) : null,
        address || null,
        layout || null,
        minArea ? parseFloat(minArea) : null,
        maxArea ? parseFloat(maxArea) : null,
        propertyType || null,
        parsedPetsAllowed,
        transportation || null,
        yearBuilt || null
      ];

      const result = await pool.query(queryText, queryValues);
      return result.rows;
    } catch (error) {
      console.error('Error in getProperties:', error);
      throw error;
    }
  }

  /**
   * Get a property by ID
   * @param {number} id - Property ID
   * @returns {Promise<Object>} - Property object
   */
  async getPropertyById(id) {
    try {
      const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Property not found');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in getPropertyById:', error);
      throw error;
    }
  }

  /**
   * Create a new property
   * @param {Object} propertyData - Property data
   * @returns {Promise<Object>} - Created property object
   */
  async createProperty(propertyData) {
    try {
      // Build the query dynamically based on the provided propertyData
      const fields = Object.keys(propertyData).join(', ');
      const placeholders = Object.keys(propertyData).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(propertyData);
      
      const queryText = `
        INSERT INTO properties (${fields})
        VALUES (${placeholders})
        RETURNING *;
      `;
      
      const result = await pool.query(queryText, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error in createProperty:', error);
      throw error;
    }
  }

  /**
   * Update an existing property
   * @param {number} id - Property ID
   * @param {Object} propertyData - Updated property data
   * @returns {Promise<Object>} - Updated property object
   */
  async updateProperty(id, propertyData) {
    try {
      // Build dynamic query based on provided fields
      const fields = Object.keys(propertyData)
        .filter(key => key !== 'id')
        .map((key, index) => `${key} = $${index + 2}`);
      
      const values = Object.values(propertyData)
        .filter((_, index) => Object.keys(propertyData)[index] !== 'id');
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      const queryText = `
        UPDATE properties
        SET ${fields.join(', ')}
        WHERE id = $1
        RETURNING *;
      `;
      
      const result = await pool.query(queryText, [id, ...values]);
      
      if (result.rows.length === 0) {
        throw new Error('Property not found');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateProperty:', error);
      throw error;
    }
  }

  /**
   * Delete a property
   * @param {number} id - Property ID
   * @returns {Promise<Object>} - Deleted property object
   */
  async deleteProperty(id) {
    try {
      const result = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Property not found');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in deleteProperty:', error);
      throw error;
    }
  }

  /**
   * Get available property layouts
   * @returns {Promise<Array>} - Array of layouts
   */
  async getLayouts() {
    try {
      const result = await pool.query('SELECT DISTINCT layout FROM properties WHERE layout IS NOT NULL ORDER BY layout');
      return result.rows.map(row => row.layout);
    } catch (error) {
      console.error('Error in getLayouts:', error);
      throw error;
    }
  }

  /**
   * Get available property types
   * @returns {Promise<Array>} - Array of property types
   */
  async getPropertyTypes() {
    try {
      const result = await pool.query('SELECT DISTINCT property_type FROM properties WHERE property_type IS NOT NULL ORDER BY property_type');
      return result.rows.map(row => row.property_type);
    } catch (error) {
      console.error('Error in getPropertyTypes:', error);
      throw error;
    }
  }
}

export default new PropertyModel();