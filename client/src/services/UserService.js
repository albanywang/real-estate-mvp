// =======================
// CLIENT-SIDE USER SERVICE
// =======================

class UserService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
  }

  // ===== AUTHENTICATION =====
  
  async register(userData) {
    try {
      console.log('🌐 UserService: Starting registration with:', userData);
      console.log('🔍 UserService: Field validation:', {
        email: !!userData.email,
        password: !!userData.password,
        fullName: !!userData.fullName
      });

      // Check if you have validation here that's failing
      if (!userData.email || !userData.password || !userData.fullName) {
        console.error('❌ UserService: Validation failed');
        throw new Error('メールアドレス、パスワード、氏名は必須です。');
      }

      const response = await fetch(`${REACT_APP_API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName  // Make sure this matches what server expects
        })
      });

      console.log('🌐 UserService: Server response status:', response.status);
      const result = await response.json();
      console.log('🌐 UserService: Server response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      return result;

    } catch (error) {
      console.error('❌ UserService registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Store token in localStorage (or secure httpOnly cookie)
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      return {
        success: true,
        user: result.user,
        token: result.token
      };
      
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        await fetch(`${this.baseURL}/users/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return { success: true };
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    }
  }

  // ===== SOCIAL LOGIN =====
  
  async googleLogin(googleToken) {
    try {
      const response = await fetch(`${this.baseURL}/users/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Google login failed');
      }

      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      return {
        success: true,
        user: result.user,
        token: result.token
      };
      
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async lineLogin(lineToken) {
    try {
      const response = await fetch(`${this.baseURL}/users/auth/line`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: lineToken }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'LINE login failed');
      }

      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      return {
        success: true,
        user: result.user,
        token: result.token
      };
      
    } catch (error) {
      console.error('LINE login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async yahooLogin(yahooToken) {
    try {
      const response = await fetch(`${this.baseURL}/users/auth/yahoo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: yahooToken }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Yahoo login failed');
      }

      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      return {
        success: true,
        user: result.user,
        token: result.token
      };
      
    } catch (error) {
      console.error('Yahoo login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== USER MANAGEMENT =====
  
  async getProfile() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to get profile');
      }

      return {
        success: true,
        user: result.user
      };
      
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProfile(userData) {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      // Update local storage
      localStorage.setItem('user', JSON.stringify(result.user));
      
      return {
        success: true,
        user: result.user
      };
      
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== PASSWORD MANAGEMENT =====
  
  async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/users/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to change password');
      }

      return {
        success: true,
        message: 'Password changed successfully'
      };
      
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${this.baseURL}/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset email');
      }

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.'
      };
      
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== FAVORITES =====
  
  async getFavorites() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/users/favorites`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to get favorites');
      }

      return {
        success: true,
        favorites: result.favorites
      };
      
    } catch (error) {
      console.error('Get favorites error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async addToFavorites(propertyId) {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/users/favorites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add to favorites');
      }

      return {
        success: true,
        message: 'Property added to favorites'
      };
      
    } catch (error) {
      console.error('Add to favorites error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async removeFromFavorites(propertyId) {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/users/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove from favorites');
      }

      return {
        success: true,
        message: 'Property removed from favorites'
      };
      
    } catch (error) {
      console.error('Remove from favorites error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== SEARCH HISTORY =====
  
  async saveSearchHistory(searchQuery, searchFilters, resultsCount) {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return; // Don't save if not logged in
      }

      await fetch(`${this.baseURL}/users/search-history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery,
          searchFilters,
          resultsCount
        }),
      });
      
    } catch (error) {
      console.error('Save search history error:', error);
      // Don't throw error - this is not critical
    }
  }

  async getSearchHistory() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/users/search-history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to get search history');
      }

      return {
        success: true,
        searchHistory: result.searchHistory
      };
      
    } catch (error) {
      console.error('Get search history error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== UTILITY METHODS =====
  
  isLoggedIn() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Debug method
  debugUser() {
    const user = this.getCurrentUser();
    const token = this.getAuthToken();
    const isLoggedIn = this.isLoggedIn();
    
    console.log('=== USER DEBUG INFO ===');
    console.log('Logged in:', isLoggedIn);
    console.log('User:', user);
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'None');
    console.log('=======================');
    
    return { user, token, isLoggedIn };
  }
}

// Create and export singleton instance
const userService = new UserService();

export default userService;

// Export individual methods for convenience
export const {
  register,
  login,
  logout,
  googleLogin,
  lineLogin,
  yahooLogin,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  saveSearchHistory,
  getSearchHistory,
  isLoggedIn,
  getCurrentUser,
  getAuthToken,
  debugUser
} = userService;