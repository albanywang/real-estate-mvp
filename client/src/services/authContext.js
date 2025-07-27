// =======================
// AUTHENTICATION CONTEXT & HOOKS
// =======================

import React, { createContext, useContext, useState, useEffect } from 'react';
import userService from './userService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        if (userService.isLoggedIn()) {
          const currentUser = userService.getCurrentUser();
          
          if (currentUser) {
            // Verify token is still valid by getting fresh profile
            const result = await userService.getProfile();
            
            if (result.success) {
              setUser(result.user);
              setIsLoggedIn(true);
            } else {
              // Token is invalid, clear auth state
              await userService.logout();
              setUser(null);
              setIsLoggedIn(false);
            }
          }
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid auth state
        await userService.logout();
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

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const result = await userService.register(userData);
      
      if (result.success) {
        // Don't automatically log in after registration
        // User needs to verify email first
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

  // Social login functions
  const googleLogin = async (googleToken) => {
    try {
      setIsLoading(true);
      const result = await userService.googleLogin(googleToken);
      
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const lineLogin = async (lineToken) => {
    try {
      setIsLoading(true);
      const result = await userService.lineLogin(lineToken);
      
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('LINE login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const yahooLogin = async (yahooToken) => {
    try {
      setIsLoading(true);
      const result = await userService.yahooLogin(yahooToken);
      
      if (result.success) {
        setUser(result.user);
        setIsLoggedIn(true);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Yahoo login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      const result = await userService.updateProfile(userData);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const result = await userService.changePassword(currentPassword, newPassword);
      return result;
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: error.message };
    }
  };

  // Reset password function
  const requestPasswordReset = async (email) => {
    try {
      const result = await userService.requestPasswordReset(email);
      return result;
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
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
    googleLogin,
    lineLogin,
    yahooLogin,
    
    // Profile methods
    updateProfile,
    changePassword,
    requestPasswordReset,
    
    // Utility methods
    debugUser: userService.debugUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component to protect routes
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isLoggedIn, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>認証を確認中...</p>
        </div>
      );
    }
    
    if (!isLoggedIn) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h2>ログインが必要です</h2>
          <p>このページにアクセスするにはログインしてください。</p>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Custom hook for favorites
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  // Load favorites when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isLoggedIn]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const result = await userService.getFavorites();
      
      if (result.success) {
        setFavorites(result.favorites);
      } else {
        console.error('Failed to load favorites:', result.error);
      }
    } catch (error) {
      console.error('Load favorites error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (propertyId) => {
    try {
      const result = await userService.addToFavorites(propertyId);
      
      if (result.success) {
        // Reload favorites to get updated list
        await loadFavorites();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Add to favorites error:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFromFavorites = async (propertyId) => {
    try {
      const result = await userService.removeFromFavorites(propertyId);
      
      if (result.success) {
        // Remove from local state immediately for better UX
        setFavorites(prev => prev.filter(fav => fav.propertyId !== propertyId));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Remove from favorites error:', error);
      return { success: false, error: error.message };
    }
  };

  const isFavorite = (propertyId) => {
    return favorites.some(fav => fav.propertyId === propertyId);
  };

  return {
    favorites,
    isLoading,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
};

// Custom hook for search history
export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadSearchHistory();
    } else {
      setSearchHistory([]);
    }
  }, [isLoggedIn]);

  const loadSearchHistory = async () => {
    try {
      setIsLoading(true);
      const result = await userService.getSearchHistory();
      
      if (result.success) {
        setSearchHistory(result.searchHistory);
      } else {
        console.error('Failed to load search history:', result.error);
      }
    } catch (error) {
      console.error('Load search history error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSearch = async (searchQuery, searchFilters, resultsCount) => {
    try {
      await userService.saveSearchHistory(searchQuery, searchFilters, resultsCount);
      // Optionally reload search history
      // await loadSearchHistory();
    } catch (error) {
      console.error('Save search error:', error);
    }
  };

  return {
    searchHistory,
    isLoading,
    loadSearchHistory,
    saveSearch
  };
};

export default AuthContext;