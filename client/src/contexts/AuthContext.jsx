import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser,
  getUserSavedProperties
} from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          // Get user's saved properties
          const savedProperties = await getUserSavedProperties();
          setUser({ ...userData, savedProperties });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    const savedProperties = await getUserSavedProperties();
    setUser({ ...userData, savedProperties });
    return userData;
  };

  const register = async (userData) => {
    const newUser = await registerUser(userData);
    setUser({ ...newUser, savedProperties: [] });
    return newUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  };

  const updateSavedProperties = async () => {
    if (user) {
      try {
        const savedProperties = await getUserSavedProperties();
        setUser((prevUser) => ({
          ...prevUser,
          savedProperties,
        }));
      } catch (error) {
        console.error('Error updating saved properties:', error);
      }
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    updateSavedProperties,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};