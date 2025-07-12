// src/services/api.js
const API_BASE_URL = process.env.REACT_API_BASE_URL 
  ? `${process.env.REACT_API_BASE_URL}/api`
  : 'http://localhost:3001/api';

// For image URLs, we need the base server URL without /api
const SERVER_BASE_URL = process.env.REACT_API_BASE_URL || 'http://localhost:3001';

/**
 * Helper function to safely parse response
 */
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  try {
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      // Try to parse as JSON anyway
      try {
        return JSON.parse(text);
      } catch {
        // If not JSON, return as error object
        return { error: text, success: false };
      }
    }
  } catch (error) {
    return { error: error.message, success: false };
  }
};

/**
 * Fetch properties with optional filters
 */
export const fetchProperties = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
   
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/properties${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching from URL:', url); // Debug log
   
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // Include cookies if needed
      headers: {
        'Accept': 'application/json'
      }
    });

    // Safely parse response only ONCE
    const result = await parseResponse(response);
    console.log('API response:', result); // Debug log
   
    if (!response.ok) {
      console.error('API error response:', result);
      throw new Error(`API error: ${response.status} - ${result.error || result.message || 'Unknown error'}`);
    }
    
    // Handle the API response structure
    if (result.success) {
      // Your API returns: { success: true, data: [...], pagination: {...}, summary: {...} }
      return {
        properties: result.data || [], // Extract the properties array
        pagination: result.pagination || {},
        summary: result.summary || {},
        total: result.pagination?.total || 0,
        count: result.count || 0
      };
    } else {
      throw new Error(result.error || 'Unknown API error');
    }
    
  } catch (error) {
    console.error('Error fetching properties:', error);
    
    // Return empty result on error instead of throwing
    return {
      properties: [],
      pagination: { total: 0, count: 0 },
      summary: {},
      total: 0,
      count: 0,
      error: error.message
    };
  }
};

/**
 * Fetch a single property by ID
 */
export const fetchPropertyById = async (id) => {
  try {
    const url = `${API_BASE_URL}/properties/${id}`;
    console.log('Fetching property by ID:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Safely parse response only ONCE
    const result = await parseResponse(response);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Property not found');
      }
      throw new Error(`API error: ${response.status} - ${result.error || result.message || 'Unknown error'}`);
    }
    
    if (result.success) {
      return result.data; // Return the property object
    } else {
      throw new Error(result.error || 'Failed to fetch property');
    }
    
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    throw error;
  }
};

/**
 * Create a new property
 */
export const createProperty = async (propertyData, images = []) => {
  try {
    const formData = new FormData();
    
    // Add property data
    Object.entries(propertyData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    
    // Add images
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      body: formData // Don't set Content-Type header for FormData
    });
    
    // Safely parse response only ONCE
    const result = await parseResponse(response);
    
    if (!response.ok) {
      throw new Error(`Create failed: ${response.status} - ${result.error || result.message || 'Unknown error'}`);
    }
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to create property');
    }
    
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

/**
 * Update an existing property
 */
export const updateProperty = async (id, propertyData, images = []) => {
  try {
    const formData = new FormData();
    
    // Add property data
    Object.entries(propertyData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    
    // Add images if provided
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      body: formData
    });
    
    // Safely parse response only ONCE
    const result = await parseResponse(response);
    
    if (!response.ok) {
      throw new Error(`Update failed: ${response.status} - ${result.error || result.message || 'Unknown error'}`);
    }
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to update property');
    }
    
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

/**
 * Delete a property
 */
export const deleteProperty = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Read response body only ONCE
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status} - ${result.error || result.message || 'Unknown error'}`);
    }
    
    if (result.success) {
      return result;
    } else {
      throw new Error(result.error || 'Failed to delete property');
    }
    
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

/**
 * Get available property options (layouts, types, etc.)
 */
export const fetchPropertyOptions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/enums`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Read response body only ONCE
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to fetch options: ${response.status} - ${result.error || result.message || 'Unknown error'}`);
    }
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to fetch options');
    }
    
  } catch (error) {
    console.error('Error fetching property options:', error);
    return {
      propertyTypes: [],
      layouts: [],
      sortOptions: []
    };
  }
};

/**
 * Get property statistics
 */
export const fetchPropertyStatistics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/statistics`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Read response body only ONCE
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to fetch statistics: ${response.status} - ${result.error || result.message || 'Unknown error'}`);
    }
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to fetch statistics');
    }
    
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      totalProperties: 0,
      averagePrice: 0,
      averageArea: 0
    };
  }
};

/**
 * Get full image URL from image path
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return `${SERVER_BASE_URL}/images/placeholder.jpg`; // Default placeholder
  }
 
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
 
  // Ensure the path starts with a slash
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
 
  // Return the full URL to the image on the backend server
  return `${SERVER_BASE_URL}${normalizedPath}`;
};

/**
 * Test API connection
 */
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Read response body only ONCE
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} - ${result.error || result.message || 'Health check failed'}`);
    }
    
    console.log('API Health Check:', result);
    
    return result.success && result.status === 'healthy';
    
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

// Debug helper function
export const debugAPI = async () => {
  console.log('🔍 API Debug Information:');
  console.log('API Base URL:', API_BASE_URL);
  console.log('Server Base URL:', SERVER_BASE_URL);
  console.log('Environment:', process.env.NODE_ENV);
  
  // Test connection
  const isHealthy = await testApiConnection();
  console.log('API Health:', isHealthy ? '✅ Healthy' : '❌ Unhealthy');
  
  // Test properties endpoint
  try {
    const result = await fetchProperties();
    console.log('Properties endpoint test:', {
      success: !!result.properties,
      count: result.properties?.length || 0,
      hasData: result.properties?.length > 0,
      firstProperty: result.properties?.[0] || null
    });
  } catch (error) {
    console.error('Properties endpoint failed:', error.message);
  }
};

  /**
   * Search locations (cities, areas, zipcodes)
   */
  export const searchLocations = async (query, limit = 10) => {
    try {
      console.log('🔍 searchLocations called with:', { query, limit });
      
      if (!query || query.trim().length < 2) {
        return {
          success: true,
          data: [],
          count: 0
        };
      }

      const url = `${API_BASE_URL}/properties/search/locations?q=${encodeURIComponent(query)}&limit=${limit}`;
      console.log('📡 Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      // Parse response only ONCE
      const result = await parseResponse(response);
      console.log('📡 Raw API response:', result);

      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status, result);
        throw new Error(`Search locations failed: ${response.status} - ${result.error || result.message || 'Unknown error'}`);
      }

      // Check if result has success property
      if (result && typeof result.success !== 'undefined') {
        if (result.success) {
          console.log('✅ Search locations successful:', result);
          return {
            success: true,
            data: result.data || [],
            count: result.count || 0
          };
        } else {
          console.error('❌ API returned success: false:', result);
          throw new Error(result.message || result.error || 'API response indicates failure');
        }
      } else {
        // Fallback: treat result as data array if no success property
        console.log('⚠️ No success property, treating as data array:', result);
        return {
          success: true,
          data: Array.isArray(result) ? result : [],
          count: Array.isArray(result) ? result.length : 0
        };
      }

    } catch (error) {
      console.error('❌ Error in searchLocations:', error);
      return {
        success: false,
        data: [],
        count: 0,
        error: error.message
      };
    }
  };

  /**
   * Get popular locations
   */
  export const getPopularLocations = async (limit = 50) => {
    try {
      console.log('🔍 getPopularLocations called with limit:', limit);
      
      const url = `${API_BASE_URL}/properties/search/popular-locations?limit=${limit}`;
      console.log('📡 Fetching popular locations from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      // Parse response only ONCE
      const result = await parseResponse(response);
      console.log('📡 Popular locations response:', result);

      if (!response.ok) {
        console.error('❌ Popular locations HTTP Error:', response.status, result);
        throw new Error(`Get popular locations failed: ${response.status} - ${result.error || result.message || 'Unknown error'}`);
      }

      if (result && result.success) {
        console.log('✅ Popular locations successful:', result);
        return {
          success: true,
          data: result.data || [],
          count: result.count || 0
        };
      } else {
        console.error('❌ Popular locations API returned success: false:', result);
        return {
          success: false,
          data: [],
          count: 0,
          error: result.message || result.error || 'Failed to get popular locations'
        };
      }

    } catch (error) {
      console.error('❌ Error in getPopularLocations:', error);
      return {
        success: false,
        data: [],
        count: 0,
        error: error.message
      };
    }
  };

  /**
   * Search properties by location
   */
  export const searchPropertiesByLocation = async (locationData, filters = {}) => {
    try {
      console.log('🔍 searchPropertiesByLocation called with:', { locationData, filters });
      
      const url = `${API_BASE_URL}/properties/search/by-location`;
      console.log('📡 POST to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          location: locationData,
          filters: filters
        })
      });

      // Parse response only ONCE
      const result = await parseResponse(response);
      console.log('📡 Search by location response:', result);

      if (!response.ok) {
        console.error('❌ Search by location HTTP Error:', response.status, result);
        throw new Error(`Search by location failed: ${response.status} - ${result.error || result.message || 'Unknown error'}`);
      }

      if (result && result.success) {
        console.log('✅ Search by location successful:', result);
        return {
          success: true,
          data: result.data || [],
          count: result.count || 0,
          location: result.location || locationData
        };
      } else {
        console.error('❌ Search by location API returned success: false:', result);
        return {
          success: false,
          data: [],
          count: 0,
          error: result.message || result.error || 'Failed to search by location'
        };
      }

    } catch (error) {
      console.error('❌ Error in searchPropertiesByLocation:', error);
      return {
        success: false,
        data: [],
        count: 0,
        error: error.message
      };
    }
  };

// Export debug function for console usage
if (typeof window !== 'undefined') {
  window.debugAPI = debugAPI;
}