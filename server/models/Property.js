const db = require('../config/database');

class Property {
  /**
   * Create a new property
   * @param {Object} propertyData - Property data
   * @returns {Promise<Object>} Newly created property
   */
  static async create(propertyData) {
    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      area,
      address,
      city,
      state,
      zip_code,
      property_type,
      listing_type,
      latitude,
      longitude,
      images = []
    } = propertyData;
    
    // Start a transaction
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert property
      const propertyQuery = `
        INSERT INTO properties (
          title, description, price, bedrooms, bathrooms, area, 
          address, city, state, zip_code, property_type, listing_type,
          location
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, ST_SetSRID(ST_MakePoint($13, $14), 4326)::geography)
        RETURNING *;
      `;
      
      const propertyValues = [
        title, description, price, bedrooms, bathrooms, area,
        address, city, state, zip_code, property_type, listing_type,
        longitude, latitude // Note: PostGIS expects longitude first, then latitude
      ];
      
      const propertyResult = await client.query(propertyQuery, propertyValues);
      const property = propertyResult.rows[0];
      
      // Insert images if provided
      if (images.length > 0) {
        const imagesQuery = `
          INSERT INTO property_images (property_id, image_url, is_primary)
          VALUES ($1, $2, $3)
          RETURNING id, image_url, is_primary;
        `;
        
        const imagePromises = images.map((image, index) => {
          return client.query(imagesQuery, [
            property.id,
            image.url,
            index === 0 // First image is primary
          ]);
        });
        
        const imageResults = await Promise.all(imagePromises);
        property.images = imageResults.map(result => result.rows[0]);
      } else {
        property.images = [];
      }
      
      await client.query('COMMIT');
      return property;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get all properties with optional filtering
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Array of properties
   */
  static async getAll(filters = {}) {
    let query = `
      SELECT 
        p.*,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude
      FROM properties p
      WHERE 1=1
    `;
    
    const values = [];
    let valueIndex = 1;
    
    // Apply filters if provided
    if (filters.location) {
      query += ` AND (
        p.city ILIKE $${valueIndex} OR
        p.address ILIKE $${valueIndex} OR
        p.zip_code ILIKE $${valueIndex}
      )`;
      values.push(`%${filters.location}%`);
      valueIndex++;
    }
    
    if (filters.type) {
      query += ` AND p.property_type = $${valueIndex}`;
      values.push(filters.type);
      valueIndex++;
    }
    
    if (filters.status && filters.status !== 'any') {
      query += ` AND p.listing_type = $${valueIndex}`;
      values.push(filters.status);
      valueIndex++;
    }
    
    if (filters.priceMin) {
      query += ` AND p.price >= $${valueIndex}`;
      values.push(parseFloat(filters.priceMin));
      valueIndex++;
    }
    
    if (filters.priceMax) {
      query += ` AND p.price <= $${valueIndex}`;
      values.push(parseFloat(filters.priceMax));
      valueIndex++;
    }
    
    if (filters.bedrooms) {
      query += ` AND p.bedrooms >= $${valueIndex}`;
      values.push(parseInt(filters.bedrooms));
      valueIndex++;
    }
    
    if (filters.bathrooms) {
      query += ` AND p.bathrooms >= $${valueIndex}`;
      values.push(parseFloat(filters.bathrooms));
      valueIndex++;
    }
    
    // Add order by clause
    query += ` ORDER BY p.created_at DESC`;
    
    try {
      // Get properties
      const result = await db.query(query, values);
      const properties = result.rows;
      
      // Get images for each property
      if (properties.length > 0) {
        const propertyIds = properties.map(p => p.id);
        
        const imagesQuery = `
          SELECT * FROM property_images 
          WHERE property_id = ANY($1)
          ORDER BY is_primary DESC
        `;
        
        const imagesResult = await db.query(imagesQuery, [propertyIds]);
        
        // Group images by property
        const imagesByProperty = imagesResult.rows.reduce((acc, img) => {
          if (!acc[img.property_id]) {
            acc[img.property_id] = [];
          }
          acc[img.property_id].push(img);
          return acc;
        }, {});
        
        // Add images to each property
        properties.forEach(property => {
          property.images = imagesByProperty[property.id] || [];
        });
      }
      
      return properties;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a property by ID
   * @param {number} id - Property ID
   * @returns {Promise<Object>} Property object
   */
  static async getById(id) {
    try {
      // Get property
      const propertyQuery = `
        SELECT 
          p.*,
          ST_X(location::geometry) as longitude,
          ST_Y(location::geometry) as latitude
        FROM properties p
        WHERE p.id = $1
      `;
      
      const propertyResult = await db.query(propertyQuery, [id]);
      
      if (propertyResult.rows.length === 0) {
        return null;
      }
      
      const property = propertyResult.rows[0];
      
      // Get images
      const imagesQuery = `
        SELECT * FROM property_images 
        WHERE property_id = $1
        ORDER BY is_primary DESC
      `;
      
      const imagesResult = await db.query(imagesQuery, [id]);
      property.images = imagesResult.rows;
      
      return property;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a property
   * @param {number} id - Property ID
   * @param {Object} propertyData - Updated property data
   * @returns {Promise<Object>} Updated property
   */
  static async update(id, propertyData) {
    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      area,
      address,
      city,
      state,
      zip_code,
      property_type,
      listing_type,
      latitude,
      longitude
    } = propertyData;
    
    const query = `
      UPDATE properties 
      SET 
        title = $1,
        description = $2,
        price = $3,
        bedrooms = $4,
        bathrooms = $5,
        area = $6,
        address = $7,
        city = $8,
        state = $9,
        zip_code = $10,
        property_type = $11,
        listing_type = $12,
        location = ST_SetSRID(ST_MakePoint($13, $14), 4326)::geography,
        updated_at = NOW()
      WHERE id = $15
      RETURNING *,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude;
    `;
    
    const values = [
      title, description, price, bedrooms, bathrooms, area,
      address, city, state, zip_code, property_type, listing_type,
      longitude, latitude, id
    ];
    
    try {
      const result = await db.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a property
   * @param {number} id - Property ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM properties WHERE id = $1 RETURNING id';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get nearby properties
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} radius - Radius in meters (default: 5000m = 5km)
   * @returns {Promise<Array>} Array of nearby properties
   */
  static async getNearby(lat, lng, radius = 5000) {
    const query = `
      SELECT 
        p.*,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        ST_Distance(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) as distance
      FROM properties p
      WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography, $3)
      ORDER BY distance
      LIMIT 20;
    `;
    
    try {
      const result = await db.query(query, [lat, lng, radius]);
      
      // Get images for each property
      if (result.rows.length > 0) {
        const propertyIds = result.rows.map(p => p.id);
        
        const imagesQuery = `
          SELECT * FROM property_images 
          WHERE property_id = ANY($1)
          ORDER BY is_primary DESC
        `;
        
        const imagesResult = await db.query(imagesQuery, [propertyIds]);
        
        // Group images by property
        const imagesByProperty = imagesResult.rows.reduce((acc, img) => {
          if (!acc[img.property_id]) {
            acc[img.property_id] = [];
          }
          acc[img.property_id].push(img);
          return acc;
        }, {});
        
        // Add images to each property
        result.rows.forEach(property => {
          property.images = imagesByProperty[property.id] || [];
          
          // Format distance for better readability
          property.distance = property.distance ? Math.round(property.distance) : null;
        });
      }
      
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Property;