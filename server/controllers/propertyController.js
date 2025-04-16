const Property = require('../models/Property');
const geocodingService = require('../services/geocodingService');

module.exports = {
  /**
   * Create a new property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createProperty: async (req, res) => {
    try {
      const propertyData = req.body;
      
      // If coordinates are not provided, geocode the address
      if (!propertyData.latitude || !propertyData.longitude) {
        const fullAddress = `${propertyData.address}, ${propertyData.city}, ${propertyData.state} ${propertyData.zip_code}`;
        
        try {
          const coordinates = await geocodingService.geocodeAddress(fullAddress);
          propertyData.latitude = coordinates.latitude;
          propertyData.longitude = coordinates.longitude;
        } catch (geocodeError) {
          return res.status(400).json({ 
            message: 'Could not geocode the provided address',
            error: geocodeError.message
          });
        }
      }
      
      const property = await Property.create(propertyData);
      
      res.status(201).json({
        message: 'Property created successfully',
        property
      });
    } catch (error) {
      console.error('Create property error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get all properties with optional filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getProperties: async (req, res) => {
    try {
      const filters = req.query;
      const properties = await Property.getAll(filters);
      
      res.json(properties);
    } catch (error) {
      console.error('Get properties error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get a property by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getPropertyById: async (req, res) => {
    try {
      const { id } = req.params;
      const property = await Property.getById(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json(property);
    } catch (error) {
      console.error('Get property by ID error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Update a property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateProperty: async (req, res) => {
    try {
      const { id } = req.params;
      const propertyData = req.body;
      
      // If address components are updated but coordinates are not provided, geocode the address
      if (
        (propertyData.address || propertyData.city || propertyData.state || propertyData.zip_code) &&
        (!propertyData.latitude || !propertyData.longitude)
      ) {
        // First get the current property data
        const currentProperty = await Property.getById(id);
        
        if (!currentProperty) {
          return res.status(404).json({ message: 'Property not found' });
        }
        
        // Combine current data with updates for geocoding
        const address = propertyData.address || currentProperty.address;
        const city = propertyData.city || currentProperty.city;
        const state = propertyData.state || currentProperty.state;
        const zip_code = propertyData.zip_code || currentProperty.zip_code;
        
        const fullAddress = `${address}, ${city}, ${state} ${zip_code}`;
        
        try {
          const coordinates = await geocodingService.geocodeAddress(fullAddress);
          propertyData.latitude = coordinates.latitude;
          propertyData.longitude = coordinates.longitude;
        } catch (geocodeError) {
          return res.status(400).json({ 
            message: 'Could not geocode the updated address',
            error: geocodeError.message
          });
        }
      }
      
      const updatedProperty = await Property.update(id, propertyData);
      
      if (!updatedProperty) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json({
        message: 'Property updated successfully',
        property: updatedProperty
      });
    } catch (error) {
      console.error('Update property error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Delete a property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteProperty: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Property.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      console.error('Delete property error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get nearby properties
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getNearbyProperties: async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;
      
      // Validate parameters
      if (!lat || !lng) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
      }
      
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const searchRadius = radius ? parseFloat(radius) : 5000; // Default 5km
      
      if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
        return res.status(400).json({ message: 'Invalid coordinate or radius values' });
      }
      
      const properties = await Property.getNearby(latitude, longitude, searchRadius);
      
      res.json(properties);
    } catch (error) {
      console.error('Get nearby properties error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Search properties by location
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  searchProperties: async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      // Use the regular getAll method with location filter
      const properties = await Property.getAll({ location: query });
      
      res.json(properties);
    } catch (error) {
      console.error('Search properties error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Add image to property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  addPropertyImage: async (req, res) => {
    try {
      const { id } = req.params;
      const { image_url, is_primary } = req.body;
      
      // Check if property exists
      const property = await Property.getById(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      // Add image
      const query = `
        INSERT INTO property_images (property_id, image_url, is_primary)
        VALUES ($1, $2, $3)
        RETURNING id, image_url, is_primary;
      `;
      
      const values = [id, image_url, is_primary || false];
      
      const result = await db.query(query, values);
      const image = result.rows[0];
      
      res.status(201).json({
        message: 'Image added successfully',
        image
      });
    } catch (error) {
      console.error('Add property image error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Remove image from property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  removePropertyImage: async (req, res) => {
    try {
      const { id, imageId } = req.params;
      
      // Check if property exists
      const property = await Property.getById(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      // Remove image
      const query = 'DELETE FROM property_images WHERE id = $1 AND property_id = $2 RETURNING id';
      const result = await db.query(query, [imageId, id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      res.json({ message: 'Image removed successfully' });
    } catch (error) {
      console.error('Remove property image error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Set primary image for property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  setPrimaryImage: async (req, res) => {
    try {
      const { id, imageId } = req.params;
      
      // Check if property exists
      const property = await Property.getById(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      // Start a transaction
      const client = await db.pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // First, set all images as non-primary
        await client.query(
          'UPDATE property_images SET is_primary = false WHERE property_id = $1',
          [id]
        );
        
        // Then set the specified image as primary
        const updateResult = await client.query(
          'UPDATE property_images SET is_primary = true WHERE id = $1 AND property_id = $2 RETURNING id',
          [imageId, id]
        );
        
        if (updateResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ message: 'Image not found' });
        }
        
        await client.query('COMMIT');
        
        res.json({ message: 'Primary image updated successfully' });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Set primary image error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};