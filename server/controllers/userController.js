const User = require('../models/User');

module.exports = {
  /**
   * Update user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { first_name, last_name, phone, current_password, new_password } = req.body;
      
      // If changing password, verify current password
      if (new_password) {
        if (!current_password) {
          return res.status(400).json({ message: 'Current password is required to set a new password' });
        }
        
        // Get user with password hash
        const user = await User.findByEmail(req.user.email);
        
        // Verify current password
        const isValidPassword = await User.comparePassword(current_password, user.password_hash);
        if (!isValidPassword) {
          return res.status(401).json({ message: 'Current password is incorrect' });
        }
      }
      
      // Update user profile
      const userData = {
        first_name,
        last_name,
        phone
      };
      
      // Add password to userData if provided
      if (new_password) {
        userData.password = new_password;
      }
      
      const updatedUser = await User.update(userId, userData);
      
      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          phone: updatedUser.phone,
          updated_at: updatedUser.updated_at
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get saved properties for the current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSavedProperties: async (req, res) => {
    try {
      const userId = req.user.id;
      const propertyIds = await User.getSavedProperties(userId);
      
      res.json(propertyIds);
    } catch (error) {
      console.error('Get saved properties error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get full saved property details for the current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSavedPropertyDetails: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Get saved property IDs
      const propertyIds = await User.getSavedProperties(userId);
      
      if (propertyIds.length === 0) {
        return res.json([]);
      }
      
      // Get full property details
      const query = `
        SELECT 
          p.*,
          ST_X(location::geometry) as longitude,
          ST_Y(location::geometry) as latitude
        FROM properties p
        WHERE p.id = ANY($1)
        ORDER BY p.created_at DESC
      `;
      
      const result = await db.query(query, [propertyIds]);
      const properties = result.rows;
      
      // Get images for each property
      if (properties.length > 0) {
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
      
      res.json(properties);
    } catch (error) {
      console.error('Get saved property details error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Toggle a property in user's saved properties
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  toggleSavedProperty: async (req, res) => {
    try {
      const userId = req.user.id;
      const { propertyId } = req.params;
      
      const result = await User.toggleSavedProperty(userId, propertyId);
      
      res.json(result);
    } catch (error) {
      console.error('Toggle saved property error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};