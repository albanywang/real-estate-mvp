// server/models/User.js - PostgreSQL Version
import { query } from '../config/database.js';

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.password_hash;
    this.fullName = data.full_name;
    this.phone = data.phone;
    this.dateOfBirth = data.date_of_birth;
    this.gender = data.gender;
    this.profileImageUrl = data.profile_image_url;
    this.emailVerified = data.email_verified;
    this.emailVerificationToken = data.email_verification_token;
    this.passwordResetToken = data.password_reset_token;
    this.passwordResetExpires = data.password_reset_expires;
    this.preferredLanguage = data.preferred_language;
    this.notificationPreferences = data.notification_preferences;
    this.accountStatus = data.account_status;
    this.lastLogin = data.last_login;
    this.loginCount = data.login_count;
    this.googleId = data.google_id;
    this.lineId = data.line_id;
    this.yahooId = data.yahoo_id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Convert database row to User object
  static fromRow(row) {
    if (!row) return null;
    return new User(row);
  }

  // Convert to safe format (remove sensitive data)
  toSafeFormat() {
    const safe = { ...this };
    delete safe.passwordHash;
    delete safe.emailVerificationToken;
    delete safe.passwordResetToken;
    delete safe.passwordResetExpires;
    return safe;
  }

  // Static methods for validation
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    return password && password.length >= 8;
  }

  static validatePhone(phone) {
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    return !phone || phoneRegex.test(phone);
  }

  static validateGender(gender) {
    const validGenders = ['male', 'female', 'other'];
    return !gender || validGenders.includes(gender);
  }

  static validateLanguage(language) {
    const validLanguages = ['ja', 'en'];
    return !language || validLanguages.includes(language);
  }

  static validateAccountStatus(status) {
    const validStatuses = ['active', 'suspended', 'deleted'];
    return validStatuses.includes(status);
  }

  // Instance methods
  isEmailVerified() {
    return this.emailVerified === true;
  }

  isActive() {
    return this.accountStatus === 'active';
  }

  isSuspended() {
    return this.accountStatus === 'suspended';
  }

  isDeleted() {
    return this.accountStatus === 'deleted';
  }

  hasGoogleAuth() {
    return !!this.googleId;
  }

  hasLineAuth() {
    return !!this.lineId;
  }

  hasYahooAuth() {
    return !!this.yahooId;
  }

  getDisplayName() {
    return this.fullName || this.email.split('@')[0];
  }

  getProfileInitial() {
    return this.fullName ? this.fullName.charAt(0).toUpperCase() : 'U';
  }
}

// =======================
// USER SESSION MODEL
// =======================

class UserSession {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.expiresAt = data.expires_at;
    this.createdAt = data.created_at;
    this.lastActivity = data.last_activity;
    this.ipAddress = data.ip_address;
    this.userAgent = data.user_agent;
  }

  static fromRow(row) {
    if (!row) return null;
    return new UserSession(row);
  }

  isExpired() {
    return new Date() > new Date(this.expiresAt);
  }

  isActive() {
    return !this.isExpired();
  }
}

// =======================
// USER FAVORITE MODEL
// =======================

class UserFavorite {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.propertyId = data.property_id;
    this.createdAt = data.created_at;
    // Include property data if joined
    this.property = data.property;
  }

  static fromRow(row) {
    if (!row) return null;
    return new UserFavorite(row);
  }
}

// =======================
// SEARCH HISTORY MODEL
// =======================

class SearchHistory {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.searchQuery = data.search_query;
    this.searchFilters = data.search_filters;
    this.resultsCount = data.results_count;
    this.createdAt = data.created_at;
  }

  static fromRow(row) {
    if (!row) return null;
    
    // Parse JSON filters if they're stored as JSONB
    let searchFilters = row.search_filters;
    if (typeof searchFilters === 'string') {
      try {
        searchFilters = JSON.parse(searchFilters);
      } catch (e) {
        searchFilters = {};
      }
    }

    return new SearchHistory({
      ...row,
      search_filters: searchFilters
    });
  }

  getFilterSummary() {
    if (!this.searchFilters || typeof this.searchFilters !== 'object') {
      return '';
    }

    const filters = [];
    
    if (this.searchFilters.propertyType) {
      filters.push(`種別: ${this.searchFilters.propertyType}`);
    }
    
    if (this.searchFilters.minPrice || this.searchFilters.maxPrice) {
      const min = this.searchFilters.minPrice ? `${this.searchFilters.minPrice}万円` : '';
      const max = this.searchFilters.maxPrice ? `${this.searchFilters.maxPrice}万円` : '';
      if (min && max) {
        filters.push(`価格: ${min}～${max}`);
      } else if (min) {
        filters.push(`価格: ${min}以上`);
      } else if (max) {
        filters.push(`価格: ${max}以下`);
      }
    }
    
    if (this.searchFilters.minArea || this.searchFilters.maxArea) {
      const min = this.searchFilters.minArea ? `${this.searchFilters.minArea}㎡` : '';
      const max = this.searchFilters.maxArea ? `${this.searchFilters.maxArea}㎡` : '';
      if (min && max) {
        filters.push(`面積: ${min}～${max}`);
      } else if (min) {
        filters.push(`面積: ${min}以上`);
      } else if (max) {
        filters.push(`面積: ${max}以下`);
      }
    }

    return filters.join(', ');
  }
}

// =======================
// POSTGRESQL SCHEMAS
// =======================

const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    profile_image_url VARCHAR(500),
    
    -- Authentication
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    
    -- User preferences
    preferred_language VARCHAR(5) DEFAULT 'ja' CHECK (preferred_language IN ('ja', 'en')),
    notification_preferences JSONB DEFAULT '{}',
    
    -- Account status
    account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deleted')),
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    
    -- Social logins
    google_id VARCHAR(255),
    line_id VARCHAR(255),
    yahoo_id VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
  CREATE INDEX IF NOT EXISTS idx_users_line_id ON users(line_id);
  CREATE INDEX IF NOT EXISTS idx_users_yahoo_id ON users(yahoo_id);
  CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);

  -- Create trigger for updated_at
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  DROP TRIGGER IF EXISTS update_users_updated_at ON users;
  CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;

const CREATE_USER_SESSIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
`;

const CREATE_USER_FAVORITES_TABLE = `
  CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, property_id)
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);
`;

const CREATE_USER_SEARCH_HISTORY_TABLE = `
  CREATE TABLE IF NOT EXISTS user_search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    search_query TEXT,
    search_filters JSONB DEFAULT '{}',
    results_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_user_search_history_user_id ON user_search_history(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_search_history_created_at ON user_search_history(created_at);
  CREATE INDEX IF NOT EXISTS idx_user_search_history_filters ON user_search_history USING GIN (search_filters);
`;

// Function to initialize all tables
const initializeUserTables = async () => {
  try {
    console.log('🔧 Creating user tables...');
    
    await query(CREATE_USERS_TABLE);
    console.log('✅ Users table created');
    
    await query(CREATE_USER_SESSIONS_TABLE);
    console.log('✅ User sessions table created');
    
    await query(CREATE_USER_FAVORITES_TABLE);
    console.log('✅ User favorites table created');
    
    await query(CREATE_USER_SEARCH_HISTORY_TABLE);
    console.log('✅ User search history table created');
    
    console.log('🎉 All user tables initialized successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing user tables:', error);
    throw error;
  }
};

// ES6 Exports
export {
  User,
  UserSession,
  UserFavorite,
  SearchHistory,
  initializeUserTables,
  CREATE_USERS_TABLE,
  CREATE_USER_SESSIONS_TABLE,
  CREATE_USER_FAVORITES_TABLE,
  CREATE_USER_SEARCH_HISTORY_TABLE
};