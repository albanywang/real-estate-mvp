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

// Export debug function for console usage
if (typeof window !== 'undefined') {
  window.debugAPI = debugAPI;
}