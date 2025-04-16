// Mock API service for frontend development
// In a real application, this would make actual HTTP requests to your backend

// Simulated delay for API calls (ms)
const API_DELAY = 800;

// Simulated JWT token storage
const TOKEN_KEY = 'homequest_auth_token';

// Mock database
let mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed
    phone: '(123) 456-7890',
  },
];

let mockProperties = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    description: 'A beautiful modern apartment in the heart of downtown with stunning city views.',
    price: 500000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    property_type: 'apartment',
    listing_type: 'sale',
    location: {
      type: 'Point',
      coordinates: [-74.006, 40.7128] // [longitude, latitude]
    },
    images: [
      {
        id: 1,
        image_url: 'https://via.placeholder.com/800x600?text=Apartment+1',
        is_primary: true
      },
      {
        id: 2,
        image_url: 'https://via.placeholder.com/800x600?text=Apartment+2',
        is_primary: false
      }
    ]
  },
  {
    id: 2,
    title: 'Luxurious Family Home',
    description: 'Spacious family home with large backyard and modern amenities.',
    price: 850000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    address: '456 Oak Lane',
    city: 'Brooklyn',
    state: 'NY',
    zip_code: '11201',
    property_type: 'house',
    listing_type: 'sale',
    location: {
      type: 'Point',
      coordinates: [-73.9496, 40.6526]
    },
    images: [
      {
        id: 3,
        image_url: 'https://via.placeholder.com/800x600?text=House+1',
        is_primary: true
      },
      {
        id: 4,
        image_url: 'https://via.placeholder.com/800x600?text=House+2',
        is_primary: false
      }
    ]
  },
  {
    id: 3,
    title: 'Cozy Studio Near Park',
    description: 'Charming studio apartment located just steps away from Central Park.',
    price: 2200,
    bedrooms: 0,
    bathrooms: 1,
    area: 500,
    address: '789 Park Ave',
    city: 'New York',
    state: 'NY',
    zip_code: '10021',
    property_type: 'apartment',
    listing_type: 'rent',
    location: {
      type: 'Point',
      coordinates: [-73.9654, 40.7829]
    },
    images: [
      {
        id: 5,
        image_url: 'https://via.placeholder.com/800x600?text=Studio+1',
        is_primary: true
      }
    ]
  }
];

let mockSavedProperties = [
  {
    user_id: 1,
    property_id: 1
  },
];

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  // In a real app, you would decode the JWT
  // This is a simplified version
  const userId = 1; // Mock user ID from token
  return mockUsers.find(user => user.id === userId);
};

// API functions
export const loginUser = async (email, password) => {
  await delay(API_DELAY);
  
  const user = mockUsers.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  
  // In a real app, you'd get a JWT from the server
  const token = 'mock_jwt_token';
  setToken(token);
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const registerUser = async (userData) => {
  await delay(API_DELAY);
  
  // Check if email already exists
  if (mockUsers.some(u => u.email === userData.email)) {
    throw new Error('Email already in use');
  }
  
  const newUser = {
    id: mockUsers.length + l,
    ...userData,
  };
  
  mockUsers.push(newUser);
  
  // Set token
  const token = 'mock_jwt_token';
  setToken(token);
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const logoutUser = async () => {
  await delay(API_DELAY);
  setToken(null);
};

export const getCurrentUser = async () => {
  await delay(API_DELAY);
  const user = getUserFromToken();
  
  if (!user) return null;
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserProfile = async (userData) => {
  await delay(API_DELAY);
  
  const user = getUserFromToken();
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  // Validate current password if changing password
  if (userData.newPassword && userData.currentPassword !== user.password) {
    throw new Error('Current password is incorrect');
  }
  
  // Update user
  const updatedUser = {
    ...user,
    firstName: userData.firstName || user.firstName,
    lastName: userData.lastName || user.lastName,
    phone: userData.phone || user.phone,
  };
  
  if (userData.newPassword) {
    updatedUser.password = userData.newPassword;
  }
  
  // Update in mock database
  mockUsers = mockUsers.map(u => u.id === user.id ? updatedUser : u);
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const getProperties = async (filters = {}) => {
  await delay(API_DELAY);
  
  let filteredProperties = [...mockProperties];
  
  // Apply filters
  if (filters.location) {
    const locationLower = filters.location.toLowerCase();
    filteredProperties = filteredProperties.filter(p => 
      p.city.toLowerCase().includes(locationLower) || 
      p.address.toLowerCase().includes(locationLower) || 
      p.zip_code.includes(locationLower)
    );
  }
  
  if (filters.type) {
    filteredProperties = filteredProperties.filter(p => 
      p.property_type === filters.type
    );
  }
  
  if (filters.status && filters.status !== 'any') {
    filteredProperties = filteredProperties.filter(p => 
      p.listing_type === filters.status
    );
  }
  
  if (filters.priceMin) {
    filteredProperties = filteredProperties.filter(p => 
      p.price >= parseFloat(filters.priceMin)
    );
  }
  
  if (filters.priceMax) {
    filteredProperties = filteredProperties.filter(p => 
      p.price <= parseFloat(filters.priceMax)
    );
  }
  
  if (filters.bedrooms) {
    filteredProperties = filteredProperties.filter(p => 
      p.bedrooms >= parseInt(filters.bedrooms)
    );
  }
  
  if (filters.bathrooms) {
    filteredProperties = filteredProperties.filter(p => 
      p.bathrooms >= parseFloat(filters.bathrooms)
    );
  }
  
  return filteredProperties;
};

export const getPropertyById = async (id) => {
  await delay(API_DELAY);
  
  const property = mockProperties.find(p => p.id === parseInt(id));
  
  if (!property) {
    throw new Error('Property not found');
  }
  
  return property;
};

export const getNearbyProperties = async (lat, lng, distance = 5000) => {
  await delay(API_DELAY);
  
  // In a real app, this would use PostGIS spatial queries
  // This is a simplified version that just returns all properties
  return mockProperties;
};

export const toggleSavedProperty = async (propertyId) => {
  await delay(API_DELAY);
  
  const user = getUserFromToken();
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  const userId = user.id;
  
  // Check if already saved
  const existingSave = mockSavedProperties.find(
    sp => sp.user_id === userId && sp.property_id === parseInt(propertyId)
  );
  
  if (existingSave) {
    // Remove if already saved
    mockSavedProperties = mockSavedProperties.filter(
      sp => !(sp.user_id === userId && sp.property_id === parseInt(propertyId))
    );
  } else {
    // Add if not saved
    mockSavedProperties.push({
      user_id: userId,
      property_id: parseInt(propertyId)
    });
  }
  
  return { saved: !existingSave };
};

export const getUserSavedProperties = async () => {
  await delay(API_DELAY);
  
  const user = getUserFromToken();
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  const userId = user.id;
  
  // Get IDs of saved properties
  const savedPropertyIds = mockSavedProperties
    .filter(sp => sp.user_id === userId)
    .map(sp => sp.property_id);
  
  return savedPropertyIds;
};

export const getSavedProperties = async () => {
  await delay(API_DELAY);
  
  const user = getUserFromToken();
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  const userId = user.id;
  
  // Get IDs of saved properties
  const savedPropertyIds = mockSavedProperties
    .filter(sp => sp.user_id === userId)
    .map(sp => sp.property_id);
  
  // Get property details
  const savedProperties = mockProperties.filter(p => savedPropertyIds.includes(p.id));
  
  return savedProperties;
};

export const searchPropertiesByLocation = async (query) => {
  await delay(API_DELAY);
  
  // In a real app, this would use a geocoding service
  // and possibly a search API
  
  // This is a simplified mock implementation
  const queryLower = query.toLowerCase();
  
  return mockProperties.filter(p => 
    p.city.toLowerCase().includes(queryLower) || 
    p.address.toLowerCase().includes(queryLower) || 
    p.zip_code.includes(queryLower)
  );
};

export const getPropertyStats = async () => {
  await delay(API_DELAY);
  
  // Mock statistics for dashboard
  return {
    totalProperties: mockProperties.length,
    forSale: mockProperties.filter(p => p.listing_type === 'sale').length,
    forRent: mockProperties.filter(p => p.listing_type === 'rent').length,
    averagePrice: Math.round(
      mockProperties.reduce((acc, p) => acc + p.price, 0) / mockProperties.length
    ),
    recentlyAdded: mockProperties.slice(0, 3),
  };
};