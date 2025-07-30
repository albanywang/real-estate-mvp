// server/services/userDbService.js - PostgreSQL Version

import { User, UserSession, UserFavorite, SearchHistory, initializeUserTables } from '../models/User.js';
// Use Supabase client like your main server:
import { createClient } from '@supabase/supabase-js';

class userDbService {
  
  // =======================
  // USER CRUD OPERATIONS
  // =======================
  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  async createUser(userData) {
    try {
      console.log('Creating user with data:', userData);
      const {
        email,
        password_hash,      // ✅ Changed from passwordHash
        full_name,          // ✅ Changed from fullName  
        email_verification_token, // ✅ Changed from emailVerificationToken
        preferred_language = 'ja'
      } = userData;

    // ✅ Use Supabase instead of undefined 'query' function
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
      const queryText = 'SELECT * FROM users WHERE id = $1 AND account_status != $2';
      const result = await query(queryText, [userId, 'deleted']);
      
      return result.rows.length > 0 ? User.fromRow(result.rows[0]) : null;

    } catch (error) {
      console.error('Find user by ID error:', error);
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      console.log('🔍 Finding user by email:', email);
      
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .neq('account_status', 'deleted')
        .single();
      
      console.log('🔍 Supabase query result:', { data: !!data, error });
      
      if (error) {
        console.log('🔍 Supabase error code:', error.code);
        if (error.code === 'PGRST116') {
          // No rows found
          return {
            success: false,
            error: 'ユーザーが見つかりません'
          };
        }
        throw error;
      }
      
      if (!data) {
        return {
          success: false,
          error: 'ユーザーが見つかりません'
        };
      }
      
      console.log('🔍 User found with email:', data.email);
      return {
        success: true,
        user: data  // Return the raw data, no User.fromRow needed
      };
      
    } catch (error) {
      console.error('Find user by email error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async findUserByGoogleId(googleId) {
    try {
      const queryText = 'SELECT * FROM users WHERE google_id = $1 AND account_status != $2';
      const result = await query(queryText, [googleId, 'deleted']);
      
      return result.rows.length > 0 ? User.fromRow(result.rows[0]) : null;

    } catch (error) {
      console.error('Find user by Google ID error:', error);
      throw error;
    }
  }

  async findUserByLineId(lineId) {
    try {
      const queryText = 'SELECT * FROM users WHERE line_id = $1 AND account_status != $2';
      const result = await query(queryText, [lineId, 'deleted']);
      
      return result.rows.length > 0 ? User.fromRow(result.rows[0]) : null;

    } catch (error) {
      console.error('Find user by LINE ID error:', error);
      throw error;
    }
  }

  async findUserByYahooId(yahooId) {
    try {
      const queryText = 'SELECT * FROM users WHERE yahoo_id = $1 AND account_status != $2';
      const result = await query(queryText, [yahooId, 'deleted']);
      
      return result.rows.length > 0 ? User.fromRow(result.rows[0]) : null;

    } catch (error) {
      console.error('Find user by Yahoo ID error:', error);
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const {
        fullName,
        email,
        preferredLanguage,
        profileImageUrl
      } = updateData;

      const queryText = `
        UPDATE users 
        SET full_name = $1, email = $2, preferred_language = $3, profile_image_url = $4
        WHERE id = $5
        RETURNING *
      `;

      const result = await query(queryText, [
        fullName,
        email,
        preferredLanguage,
        profileImageUrl,
        userId
      ]);

      return result.rows.length > 0 ? User.fromRow(result.rows[0]) : null;

    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async updateUserPassword(userId, newPasswordHash) {
    try {
      const queryText = 'UPDATE users SET password_hash = $1 WHERE id = $2';
      await query(queryText, [newPasswordHash, userId]);

    } catch (error) {
      console.error('Update user password error:', error);
      throw error;
    }
  }

  async updateLoginStats(userId) {
    try {
      const queryText = `
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP, 
            login_count = COALESCE(login_count, 0) + 1
        WHERE id = $1
      `;

      await query(queryText, [userId]);

    } catch (error) {
      console.error('Update login stats error:', error);
      throw error;
    }
  }

  async updateLastActivity(userId, ipAddress, userAgent) {
    try {
      // Update session activity if exists
      const sessionQuery = `
        UPDATE user_sessions 
        SET last_activity = CURRENT_TIMESTAMP, ip_address = $1, user_agent = $2
        WHERE user_id = $3 AND expires_at > CURRENT_TIMESTAMP
      `;
      await query(sessionQuery, [ipAddress, userAgent, userId]);

    } catch (error) {
      console.error('Update last activity error:', error);
      // Don't throw error for this non-critical operation
    }
  }

  async setEmailVerified(userId) {
    try {
      const queryText = `
        UPDATE users 
        SET email_verified = TRUE, email_verification_token = NULL
        WHERE id = $1
      `;

      await query(queryText, [userId]);

    } catch (error) {
      console.error('Set email verified error:', error);
      throw error;
    }
  }

  async setPasswordResetToken(userId, resetToken, resetExpires) {
    try {
      const queryText = `
        UPDATE users 
        SET password_reset_token = $1, password_reset_expires = $2
        WHERE id = $3
      `;

      await query(queryText, [resetToken, resetExpires, userId]);

    } catch (error) {
      console.error('Set password reset token error:', error);
      throw error;
    }
  }

  async clearPasswordResetToken(userId) {
    try {
      const queryText = `
        UPDATE users 
        SET password_reset_token = NULL, password_reset_expires = NULL
        WHERE id = $1
      `;

      await query(queryText, [userId]);

    } catch (error) {
      console.error('Clear password reset token error:', error);
      throw error;
    }
  }

  // =======================
  // USER SESSION OPERATIONS
  // =======================

  async createUserSession(sessionData) {
    try {
      const { userId, sessionId, ipAddress, userAgent } = sessionData;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const queryText = `
        INSERT INTO user_sessions (
          id, user_id, expires_at, ip_address, user_agent
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;

      const result = await query(queryText, [
        sessionId,
        userId,
        expiresAt,
        ipAddress,
        userAgent
      ]);

      return result.rows[0].id;

    } catch (error) {
      console.error('Create user session error:', error);
      throw error;
    }
  }

  async findUserSession(sessionId) {
    try {
      const queryText = `
        SELECT * FROM user_sessions 
        WHERE id = $1 AND expires_at > CURRENT_TIMESTAMP
      `;
      
      const result = await query(queryText, [sessionId]);
      return result.rows.length > 0 ? UserSession.fromRow(result.rows[0]) : null;

    } catch (error) {
      console.error('Find user session error:', error);
      throw error;
    }
  }

  async deleteUserSession(userId) {
    try {
      const queryText = 'DELETE FROM user_sessions WHERE user_id = $1';
      await query(queryText, [userId]);

    } catch (error) {
      console.error('Delete user session error:', error);
      throw error;
    }
  }

  async cleanupExpiredSessions() {
    try {
      const queryText = 'DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP';
      const result = await query(queryText);
      console.log(`🧹 Cleaned up ${result.rowCount} expired sessions`);

    } catch (error) {
      console.error('Cleanup expired sessions error:', error);
      throw error;
    }
  }

  // =======================
  // FAVORITES OPERATIONS
  // =======================

  async getUserFavorites(userId) {
    try {
      const queryText = `
        SELECT 
          uf.*,
          p.id as property_id,
          p.title as property_title,
          p.price as property_price,
          p.address as property_address,
          p.area as property_area,
          p.propertytype as property_type,
          p.mainimageurl as property_main_image
        FROM user_favorites uf
        LEFT JOIN properties p ON uf.property_id = p.id
        WHERE uf.user_id = $1
        ORDER BY uf.created_at DESC
      `;

      const result = await query(queryText, [userId]);
      
      return result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        propertyId: row.property_id,
        createdAt: row.created_at,
        property: {
          id: row.property_id,
          title: row.property_title,
          price: row.property_price,
          address: row.property_address,
          area: row.property_area,
          propertyType: row.property_type,
          mainImageUrl: row.property_main_image
        }
      }));

    } catch (error) {
      console.error('Get user favorites error:', error);
      throw error;
    }
  }

  async checkFavorite(userId, propertyId) {
    try {
      const queryText = `
        SELECT id FROM user_favorites 
        WHERE user_id = $1 AND property_id = $2
      `;

      const result = await query(queryText, [userId, propertyId]);
      return result.rows.length > 0;

    } catch (error) {
      console.error('Check favorite error:', error);
      throw error;
    }
  }

  async addToFavorites(userId, propertyId) {
    try {
      const queryText = `
        INSERT INTO user_favorites (user_id, property_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, property_id) DO NOTHING
        RETURNING id
      `;

      const result = await query(queryText, [userId, propertyId]);
      return result.rows.length > 0 ? result.rows[0].id : null;

    } catch (error) {
      console.error('Add to favorites error:', error);
      throw error;
    }
  }

  async removeFromFavorites(userId, propertyId) {
    try {
      const queryText = `
        DELETE FROM user_favorites 
        WHERE user_id = $1 AND property_id = $2
      `;

      await query(queryText, [userId, propertyId]);

    } catch (error) {
      console.error('Remove from favorites error:', error);
      throw error;
    }
  }

  // =======================
  // SEARCH HISTORY OPERATIONS
  // =======================

  async getUserSearchHistory(userId, limit = 50) {
    try {
      const queryText = `
        SELECT * FROM user_search_history 
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      `;

      const result = await query(queryText, [userId, limit]);
      return result.rows.map(row => SearchHistory.fromRow(row));

    } catch (error) {
      console.error('Get user search history error:', error);
      throw error;
    }
  }

  async saveSearchHistory(userId, searchData) {
    try {
      const { searchQuery, searchFilters, resultsCount } = searchData;

      const queryText = `
        INSERT INTO user_search_history (
          user_id, search_query, search_filters, results_count
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `;

      // PostgreSQL handles JSONB automatically
      const result = await query(queryText, [
        userId,
        searchQuery,
        searchFilters,
        resultsCount
      ]);

      return result.rows[0].id;

    } catch (error) {
      console.error('Save search history error:', error);
      throw error;
    }
  }

  async clearSearchHistory(userId) {
    try {
      const queryText = 'DELETE FROM user_search_history WHERE user_id = $1';
      await query(queryText, [userId]);

    } catch (error) {
      console.error('Clear search history error:', error);
      throw error;
    }
  }

  // =======================
  // ADMIN OPERATIONS
  // =======================

  async getAllUsers(options = {}) {
    try {
      const { page = 1, limit = 50, status = 'active', sortBy = 'created_at', sortOrder = 'DESC' } = options;
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE account_status != $1';
      let params = ['deleted'];

      if (status && status !== 'all') {
        whereClause += ' AND account_status = $2';
        params.push(status);
      }

      const queryText = `
        SELECT id, email, full_name, 
               email_verified, preferred_language, account_status,
               last_login, login_count, created_at, updated_at
        FROM users 
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ${params.length + 1} OFFSET ${params.length + 2}
      `;

      params.push(limit, offset);
      const result = await query(queryText, params);

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
      const countResult = await query(countQuery, params.slice(0, -2));

      return {
        users: result.rows.map(row => User.fromRow(row).toSafeFormat()),
        total: parseInt(countResult.rows[0].total),
        page,
        limit,
        totalPages: Math.ceil(countResult.rows[0].total / limit)
      };

    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  async getUserStats() {
    try {
      const queryText = `
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN account_status = 'active' THEN 1 END) as active_users,
          COUNT(CASE WHEN account_status = 'suspended' THEN 1 END) as suspended_users,
          COUNT(CASE WHEN email_verified = TRUE THEN 1 END) as verified_users,
          COUNT(CASE WHEN last_login >= CURRENT_TIMESTAMP - INTERVAL '30 days' THEN 1 END) as active_last_30_days,
          COUNT(CASE WHEN created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days' THEN 1 END) as new_last_30_days
        FROM users 
        WHERE account_status != 'deleted'
      `;

      const result = await query(queryText);
      return result.rows[0];

    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }

  async suspendUser(userId, reason = '') {
    try {
      const queryText = `
        UPDATE users 
        SET account_status = 'suspended'
        WHERE id = $1
      `;

      await query(queryText, [userId]);

      // Log suspension
      console.log(`User ${userId} suspended. Reason: ${reason}`);

    } catch (error) {
      console.error('Suspend user error:', error);
      throw error;
    }
  }

  async activateUser(userId) {
    try {
      const queryText = `
        UPDATE users 
        SET account_status = 'active'
        WHERE id = $1
      `;

      await query(queryText, [userId]);

    } catch (error) {
      console.error('Activate user error:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      // Soft delete - mark as deleted but keep data
      const queryText = `
        UPDATE users 
        SET account_status = 'deleted', 
            email = CONCAT('deleted_', id, '_', email)
        WHERE id = $1
      `;

      await query(queryText, [userId]);

      // Clean up sessions
      await this.deleteUserSession(userId);

    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // =======================
  // UTILITY METHODS
  // =======================

  async initializeTables() {
    try {
      await initializeUserTables();
      console.log('✅ User database tables initialized successfully');

    } catch (error) {
      console.error('❌ Initialize tables error:', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      // Clean up expired sessions
      await this.cleanupExpiredSessions();

      // Clean up old search history (keep last 100 entries per user)
      const cleanupQuery = `
        DELETE FROM user_search_history 
        WHERE id NOT IN (
          SELECT id FROM (
            SELECT id,
                   ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
            FROM user_search_history
          ) ranked
          WHERE rn <= 100
        )
      `;

      const result = await query(cleanupQuery);
      console.log(`🧹 Cleaned up ${result.rowCount} old search history entries`);

      console.log('✅ User database cleanup completed');

    } catch (error) {
      console.error('❌ Cleanup error:', error);
      throw error;
    }
  }

  // =======================
  // SEARCH AND ANALYTICS
  // =======================

  async searchUsers(searchTerm, options = {}) {
    try {
      const { limit = 20, offset = 0 } = options;
      
      const queryText = `
        SELECT id, email, full_name, account_status, created_at
        FROM users 
        WHERE account_status != 'deleted'
          AND (
            full_name ILIKE $1 
            OR email ILIKE $1 
          )
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const searchPattern = `%${searchTerm}%`;
      const result = await query(queryText, [searchPattern, limit, offset]);

      return result.rows.map(row => User.fromRow(row).toSafeFormat());

    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  async getUserActivityStats(userId) {
    try {
      const queryText = `
        SELECT 
          u.login_count,
          u.last_login,
          u.created_at,
          (SELECT COUNT(*) FROM user_favorites WHERE user_id = $1) as favorite_count,
          (SELECT COUNT(*) FROM user_search_history WHERE user_id = $1) as search_count,
          (SELECT COUNT(*) FROM user_sessions WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP) as active_sessions
        FROM users u
        WHERE u.id = $1
      `;

      const result = await query(queryText, [userId]);
      return result.rows[0] || null;

    } catch (error) {
      console.error('Get user activity stats error:', error);
      throw error;
    }
  }

  async getPopularSearchTerms(limit = 10) {
    try {
      const queryText = `
        SELECT 
          search_query, 
          COUNT(*) as search_count,
          AVG(results_count) as avg_results
        FROM user_search_history 
        WHERE search_query IS NOT NULL 
          AND search_query != ''
          AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
        GROUP BY search_query
        ORDER BY search_count DESC
        LIMIT $1
      `;

      const result = await query(queryText, [limit]);
      return result.rows;

    } catch (error) {
      console.error('Get popular search terms error:', error);
      throw error;
    }
  }

  async getMostFavoritedProperties(limit = 10) {
    try {
      const queryText = `
        SELECT 
          uf.property_id,
          COUNT(*) as favorite_count,
          p.title,
          p.price,
          p.address
        FROM user_favorites uf
        LEFT JOIN properties p ON uf.property_id = p.id
        WHERE uf.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
        GROUP BY uf.property_id, p.title, p.price, p.address
        ORDER BY favorite_count DESC
        LIMIT $1
      `;

      const result = await query(queryText, [limit]);
      return result.rows;

    } catch (error) {
      console.error('Get most favorited properties error:', error);
      throw error;
    }
  }

  // =======================
  // BACKUP AND EXPORT
  // =======================

  async exportUserData(userId) {
    try {
      // Get user profile
      const user = await this.findUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get favorites
      const favorites = await this.getUserFavorites(userId);

      // Get search history
      const searchHistory = await this.getUserSearchHistory(userId, 1000);

      // Get activity stats
      const activityStats = await this.getUserActivityStats(userId);

      return {
        profile: user.toSafeFormat(),
        favorites,
        searchHistory,
        activityStats,
        exportedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Export user data error:', error);
      throw error;
    }
  }

  async bulkUpdateUsers(userIds, updateData) {
    try {
      return await transaction(async (client) => {
        const results = [];
        
        for (const userId of userIds) {
          const queryText = `
            UPDATE users 
            SET account_status = COALESCE($1, account_status),
                preferred_language = COALESCE($2, preferred_language)
            WHERE id = $3
            RETURNING id, account_status, preferred_language
          `;

          const result = await client.query(queryText, [
            updateData.accountStatus,
            updateData.preferredLanguage,
            userId
          ]);

          if (result.rows.length > 0) {
            results.push(result.rows[0]);
          }
        }

        return results;
      });

    } catch (error) {
      console.error('Bulk update users error:', error);
      throw error;
    }
  }
}

export default userDbService;