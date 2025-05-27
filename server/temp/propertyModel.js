// data/propertyModel.js
import db from '../utils/db.js';

const propertyModel = {
  // Get properties with optional filtering
  getProperties: async (filters = {}) => {
    try {
      // Convert the filters object to a format that our db.getMany method can use
      const dbFilters = {};
      
      // Handle exact matches
      if (filters.propertyType) dbFilters.property_type = filters.propertyType;
      if (filters.layout) dbFilters.layout = filters.layout;
      if (filters.petsAllowed !== null && filters.petsAllowed !== undefined) {
        dbFilters.pets_allowed = filters.petsAllowed;
      }
      
      // For range and complex filters, we'll need to use a custom query
    // Use ST_X and ST_Y to extract coordinates directly in SQL
      const query = `
        SELECT 
          properties.*,
          ST_X(location::geometry) as longitude,
          ST_Y(location::geometry) as latitude
        FROM properties
        WHERE 1=1
      `;
      const params = [];
      let paramIndex = 1;
      
      if (filters.title) {
        query += ` AND title ILIKE $${paramIndex}`;
        params.push(`%${filters.title}%`);
        paramIndex++;
      }
      
      if (filters.minPrice) {
        query += ` AND price >= $${paramIndex}`;
        params.push(Number(filters.minPrice));
        paramIndex++;
      }
      
      if (filters.maxPrice) {
        query += ` AND price <= $${paramIndex}`;
        params.push(Number(filters.maxPrice));
        paramIndex++;
      }
      
      // Add other filters as needed...
      
      // Execute the query
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  },
  
  // Get property by ID
  getPropertyById: async (id) => {
    try {
      const property = await db.getById('properties', id);
      if (!property) {
        throw new Error('Property not found');
      }
      return property;
    } catch (error) {
      console.error(`Error getting property ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new property
  createProperty: async (propertyData) => {
    try {
      return await db.insert('properties', propertyData);
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },
  
  // Update a property
  updateProperty: async (id, propertyData) => {
    try {
      const property = await db.update('properties', id, propertyData);
      if (!property) {
        throw new Error('Property not found');
      }
      return property;
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a property
  deleteProperty: async (id) => {
    try {
      const property = await db.delete('properties', id);
      if (!property) {
        throw new Error('Property not found');
      }
      return property;
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  },
  
  // Get available layouts
  getLayouts: async () => {
    try {
      const result = await db.query('SELECT DISTINCT layout FROM properties');
      return result.rows.map(row => row.layout);
    } catch (error) {
      console.error('Error getting layouts:', error);
      throw error;
    }
  },
  
  // Get available property types
  getPropertyTypes: async () => {
    try {
      const result = await db.query('SELECT DISTINCT property_type FROM properties');
      return result.rows.map(row => row.property_type);
    } catch (error) {
      console.error('Error getting property types:', error);
      throw error;
    }
  }
};

export default propertyModel;