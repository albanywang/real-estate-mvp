const axios = require('axios');
require('dotenv').config();

// Using OpenStreetMap Nominatim for geocoding
// Note: For production, consider using a commercial service with better rate limits
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

module.exports = {
  /**
   * Geocode an address to get coordinates
   * @param {string} address - Full address to geocode
   * @returns {Promise<Object>} Coordinates (latitude, longitude)
   */
  geocodeAddress: async (address) => {
    try {
      const response = await axios.get(NOMINATIM_URL, {
        params: {
          q: address,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'HomeQuest Real Estate Website'
        }
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('Address not found');
      }

      const result = response.data[0];
      
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon)
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }
};