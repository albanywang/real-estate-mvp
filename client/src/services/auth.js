// auth.js - Authentication service for the real estate application

import { loginUser, registerUser, logoutUser, getCurrentUser } from './api';

// Token storage key
const TOKEN_KEY = 'homequest_auth_token';

/**
 * Handles user authentication 
 * This service provides methods for login, logout, registration,
 * and checking authentication status
 */

// Get the authentication token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Set the authentication token in localStorage
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Login a user with email and password
export const login = async (email, password) => {
  try {
    const response = await loginUser(email, password);
    
    // Store token if it's returned from the API
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  } catch (error) {
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Invalid email or password');
        case 403:
          throw new Error('Your account has been disabled');
        default:
          throw new Error('Login failed. Please try again.');
      }
    }
    throw error;
  }
};

// Register a new user
export const register = async (userData) => {
  try {
    const response = await registerUser(userData);
    
    // Store token if it's returned from the API
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  } catch (error) {
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 409:
          throw new Error('Email already in use');
        default:
          throw new Error('Registration failed. Please try again.');
      }
    }
    throw error;
  }
};

// Logout the current user
export const logout = async () => {
  try {
    await logoutUser();
    setToken(null);
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove the token on frontend even if API call fails
    setToken(null);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Get the current authenticated user
export const getAuthenticatedUser = async () => {
  if (!isAuthenticated()) {
    return null;
  }
  
  try {
    return await getCurrentUser();
  } catch (error) {
    // If token is invalid/expired, clear it
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      setToken(null);
    }
    return null;
  }
};

// Add token to requests as Authorization header
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Validate token expiration
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // JWT tokens have three parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiration claim
    if (!payload.exp) return false;
    
    // Compare expiration timestamp with current time
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return true;
  }
};

// Refresh the auth token
export const refreshToken = async () => {
  // This would make a request to your refresh token endpoint
  // For now, we'll just implement the interface
  try {
    // In a real app, you would call your refresh token API
    // const response = await axios.post('/api/auth/refresh-token');
    // setToken(response.data.token);
    // return response.data;
    
    // For now, just check if the current token is valid
    if (isAuthenticated() && !isTokenExpired(getToken())) {
      return true;
    }
    
    // If token is expired, force logout
    setToken(null);
    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    setToken(null);
    return false;
  }
};

// Setup auth interceptor for axios (to be used with your API service)
export const setupAuthInterceptor = (axiosInstance) => {
  // Request interceptor to add auth header
  axiosInstance.interceptors.request.use(
    (config) => {
      // Add token to request if available
      if (isAuthenticated()) {
        config.headers = {
          ...config.headers,
          ...getAuthHeader()
        };
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for handling token expiration
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If 401 Unauthorized and not already retrying
      if (error.response && 
          error.response.status === 401 && 
          !originalRequest._retry) {
        
        originalRequest._retry = true;
        
        // Try to refresh the token
        const refreshed = await refreshToken();
        
        if (refreshed) {
          // Retry the original request with new token
          originalRequest.headers = {
            ...originalRequest.headers,
            ...getAuthHeader()
          };
          return axiosInstance(originalRequest);
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
};

// Protected route helper for React Router
export const requireAuth = (Component) => {
  return (props) => {
    if (!isAuthenticated()) {
      // Redirect to login
      window.location.href = '/login';
      return null;
    }
    
    return <Component {...props} />;
  };
};