// server/services/userDbService.js - Fixed Supabase Version

import { createClient } from '@supabase/supabase-js';

class UserDbService {
  
  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  // =======================
  // USER CRUD OPERATIONS
  // =======================

  async createUser(userData) {
    try {
      console.log('Creating user with data:', userData);
      
      const {
        email,
        password_hash,
        full_name,
        email_verification_token,
        preferred_language = 'ja'
      } = userData;

      const { data, error } = await this.supabase
        .from('users')
        .insert({
          email,
          password_hash,
          full_name,
          email_verification_token,
          preferred_language
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase create user error:', error);
        
        // Handle specific errors
        if (error.code === '23505') { // Unique violation
          return {
            success: false,
            error: 'このメールアドレスは既に使用されています'
          };
        }
        
        return {
          success: false,
          error: 'アカウント作成中にエラーが発生しました'
        };
      }

      console.log('User created successfully:', data);
      return {
        success: true,
        user: data,
        message: 'ユーザーが正常に作成されました'
      };

    } catch (error) {
      console.error('Create user error:', error);
      return {
        success: false,
        error: 'アカウント作成中にエラーが発生しました'
      };
    }
  }

  async findUserById(userId) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .neq('account_status', 'deleted')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: 'ユーザーが見つかりません'
          };
        }
        throw error;
      }
      
      return {
        success: true,
        user: data
      };

    } catch (error) {
      console.error('Find user by ID error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async findUserByEmail(email) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .neq('account_status', 'deleted')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: 'ユーザーが見つかりません'
          };
        }
        throw error;
      }
      
      return {
        success: true,
        user: data
      };
      
    } catch (error) {
      console.error('Find user by email error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateUser(userId, updateData) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          full_name: updateData.full_name,
          profile_image_url: updateData.profile_image_url,
          preferred_language: updateData.preferred_language,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .neq('account_status', 'deleted')
        .select()
        .single();

      if (error) {
        console.error('Update user error:', error);
        return {
          success: false,
          error: 'ユーザー更新に失敗しました'
        };
      }

      return {
        success: true,
        user: data
      };

    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateLastLogin(userId) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          login_count: this.supabase.rpc('increment_login_count', { user_id: userId }),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, last_login, login_count')
        .single();

      if (error) {
        console.error('Update last login error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('Update last login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async verifyEmail(userId) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          email_verified: true,
          email_verification_token: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, email, email_verified')
        .single();

      if (error) {
        console.error('Verify email error:', error);
        return {
          success: false,
          error: 'メール認証に失敗しました'
        };
      }

      return {
        success: true,
        user: data
      };

    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteUser(userId) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          account_status: 'deleted',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, account_status')
        .single();

      if (error) {
        console.error('Delete user error:', error);
        return {
          success: false,
          error: 'ユーザー削除に失敗しました'
        };
      }

      return {
        success: true,
        message: 'ユーザーが削除されました'
      };

    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =======================
  // USER SESSION OPERATIONS
  // =======================

  async createUserSession(sessionData) {
    try {
      const { userId, sessionId, ipAddress, userAgent } = sessionData;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const { data, error } = await this.supabase
        .from('user_sessions')
        .insert({
          id: sessionId,
          user_id: userId,
          expires_at: expiresAt.toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent
        })
        .select()
        .single();

      if (error) {
        console.error('Create session error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        session: data
      };

    } catch (error) {
      console.error('Create user session error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async findUserSession(sessionId) {
    try {
      const { data, error } = await this.supabase
        .from('user_sessions')
        .select('*')
        .eq('id', sessionId)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: 'セッションが見つかりません'
          };
        }
        throw error;
      }
      
      return {
        success: true,
        session: data
      };

    } catch (error) {
      console.error('Find user session error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteUserSession(userId) {
    try {
      const { error } = await this.supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Delete session error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: 'セッションが削除されました'
      };

    } catch (error) {
      console.error('Delete user session error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =======================
  // FAVORITES OPERATIONS
  // =======================

  async getUserFavorites(userId) {
    try {
      const { data, error } = await this.supabase
        .from('user_favorites')
        .select(`
          *,
          properties:property_id (
            id,
            title,
            price,
            address,
            area,
            propertytype,
            mainimageurl
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get user favorites error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        favorites: data
      };

    } catch (error) {
      console.error('Get user favorites error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async addToFavorites(userId, propertyId) {
    try {
      const { data, error } = await this.supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          property_id: propertyId
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Already exists
          return {
            success: true,
            message: '既にお気に入りに追加されています'
          };
        }
        console.error('Add to favorites error:', error);
        return {
          success: false,
          error: 'お気に入り追加に失敗しました'
        };
      }

      return {
        success: true,
        favorite: data,
        message: 'お気に入りに追加されました'
      };

    } catch (error) {
      console.error('Add to favorites error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async removeFromFavorites(userId, propertyId) {
    try {
      const { error } = await this.supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      if (error) {
        console.error('Remove from favorites error:', error);
        return {
          success: false,
          error: 'お気に入り削除に失敗しました'
        };
      }

      return {
        success: true,
        message: 'お気に入りから削除されました'
      };

    } catch (error) {
      console.error('Remove from favorites error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =======================
  // SEARCH HISTORY OPERATIONS
  // =======================

  async getUserSearchHistory(userId, limit = 50) {
    try {
      const { data, error } = await this.supabase
        .from('user_search_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get search history error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        history: data
      };

    } catch (error) {
      console.error('Get user search history error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async saveSearchHistory(userId, searchData) {
    try {
      const { searchQuery, searchFilters, resultsCount } = searchData;

      const { data, error } = await this.supabase
        .from('user_search_history')
        .insert({
          user_id: userId,
          search_query: searchQuery,
          search_filters: searchFilters,
          results_count: resultsCount
        })
        .select()
        .single();

      if (error) {
        console.error('Save search history error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        history: data
      };

    } catch (error) {
      console.error('Save search history error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =======================
  // UTILITY METHODS
  // =======================

  async getUserStats() {
    try {
      const { data, error } = await this.supabase
        .rpc('get_user_stats');

      if (error) {
        console.error('Get user stats error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        stats: data
      };

    } catch (error) {
      console.error('Get user stats error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async cleanupExpiredSessions() {
    try {
      const { error } = await this.supabase
        .from('user_sessions')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Cleanup sessions error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('🧹 Expired sessions cleaned up');
      return {
        success: true,
        message: 'Expired sessions cleaned up'
      };

    } catch (error) {
      console.error('Cleanup expired sessions error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create and export a singleton instance
const userDbService = new UserDbService();
export default userDbService;