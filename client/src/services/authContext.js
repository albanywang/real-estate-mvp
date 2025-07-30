// services/AuthContext.js - SIMPLIFIED VERSION FOR DEBUGGING
import React, { createContext, useContext, useState, useEffect } from 'react';
import userService from './UserService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simplified initialization - no API calls for now
  useEffect(() => {
    const initializeAuth = () => {
      try {
        console.log('AuthContext: Initializing...');
        setIsLoading(true);
        
        // Check if user is logged in (without API call)
        if (userService.isLoggedIn()) {
          const currentUser = userService.getCurrentUser();
          console.log('AuthContext: Found stored user:', currentUser);
          
          if (currentUser) {
            setUser(currentUser);
            setIsLoggedIn(true);
          }
        }
        
        console.log('AuthContext: Initialization complete');
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('AuthContext: Login attempt for:', email);
      setIsLoading(true);
      const result = await userService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const result = await userService.register(userData);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      console.log('AuthContext: Logout');
      setIsLoading(true);
      await userService.logout();
      setUser(null);
      setIsLoggedIn(false);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    // State
    user,
    isLoggedIn,
    isLoading,
    
    // Authentication methods
    login,
    register,
    logout,
    
    // Utility methods
    debugUser: userService ? userService.debugUser : () => console.log('UserService not available')
  };

  console.log('AuthContext: Rendering provider with value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  console.log('useAuth: Hook called');
  const context = useContext(AuthContext);
  
  if (!context) {
    console.error('useAuth: No context found - component not wrapped in AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  console.log('useAuth: Returning context:', context);
  return context;
};

