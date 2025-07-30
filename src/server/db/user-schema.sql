-- ================================
-- POSTGRESQL SCHEMAS FOR SUPABASE - SIMPLIFIED
-- ================================
-- Enable PostGIS extension (run this once in your database if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Drop existing table and all dependencies
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing ENUM types if they exist and recreate them
DROP TYPE IF EXISTS account_status_enum CASCADE;
DROP TYPE IF EXISTS language_enum CASCADE;
DROP TYPE IF EXISTS gender_enum CASCADE; -- Clean up the old gender enum too

-- Create ENUM types
CREATE TYPE account_status_enum AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE language_enum AS ENUM ('ja', 'en');

-- ================================
-- USERS TABLE - SIMPLIFIED
-- ================================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  profile_image_url VARCHAR(500),
  
  -- Authentication
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMPTZ,
  
  -- User preferences
  preferred_language language_enum DEFAULT 'ja',
  notification_preferences JSONB DEFAULT '{}',
  
  -- Account status
  account_status account_status_enum DEFAULT 'active',
  last_login TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  
  -- Social logins
  google_id VARCHAR(255),
  line_id VARCHAR(255),
  yahoo_id VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_line_id ON users(line_id);
CREATE INDEX IF NOT EXISTS idx_users_yahoo_id ON users(yahoo_id);
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- ================================
-- USER SESSIONS TABLE
-- ================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for user_sessions table
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- ================================
-- USER FAVORITES TABLE
-- ================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id BIGINT NOT NULL, -- References properties(id) but we'll add FK later
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique user-property combination
  UNIQUE(user_id, property_id)
);

-- Create indexes for user_favorites table
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at);

-- ================================
-- USER SEARCH HISTORY TABLE
-- ================================
CREATE TABLE IF NOT EXISTS user_search_history (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  search_query TEXT,
  search_filters JSONB DEFAULT '{}',
  results_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for user_search_history table
CREATE INDEX IF NOT EXISTS idx_user_search_history_user_id ON user_search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_search_history_created_at ON user_search_history(created_at);

-- ================================
-- TRIGGERS FOR UPDATED_AT
-- ================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- ================================

-- Enable RLS on tables (optional, for additional security)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_search_history ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (uncomment if you want to use them)
-- CREATE POLICY users_can_view_own_data ON users
--   FOR ALL USING (auth.uid()::text = id::text);

-- CREATE POLICY users_can_manage_own_sessions ON user_sessions
--   FOR ALL USING (auth.uid()::text = user_id::text);

-- CREATE POLICY users_can_manage_own_favorites ON user_favorites
--   FOR ALL USING (auth.uid()::text = user_id::text);

-- CREATE POLICY users_can_manage_own_search_history ON user_search_history
--   FOR ALL USING (auth.uid()::text = user_id::text);

-- ================================
-- SAMPLE DATA (for testing)
-- ================================

-- Insert a test user (password is 'password123' hashed)
-- INSERT INTO users (email, password_hash, full_name, email_verified) VALUES 
-- ('test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/5Q9B5f1J6', 'Test User', true)
-- ON CONFLICT (email) DO NOTHING;

-- ================================
-- USEFUL QUERIES FOR MANAGEMENT
-- ================================

-- View user statistics
/*
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN account_status = 'active' THEN 1 END) as active_users,
  COUNT(CASE WHEN account_status = 'suspended' THEN 1 END) as suspended_users,
  COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users,
  COUNT(CASE WHEN last_login >= NOW() - INTERVAL '30 days' THEN 1 END) as active_last_30_days,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_last_30_days
FROM users 
WHERE account_status != 'deleted';
*/

-- Clean up expired sessions
/*
DELETE FROM user_sessions WHERE expires_at <= NOW();
*/

-- View user favorites with property details (adjust based on your properties table)
/*
SELECT 
  u.full_name,
  uf.created_at as favorited_at,
  p.title as property_title,
  p.price as property_price
FROM user_favorites uf
JOIN users u ON uf.user_id = u.id
JOIN properties p ON uf.property_id = p.id
ORDER BY uf.created_at DESC;
*/

-- ================================
-- FOREIGN KEY FOR PROPERTIES
-- ================================

-- Add this after you create your properties table
-- ALTER TABLE user_favorites 
-- ADD CONSTRAINT fk_user_favorites_property_id 
-- FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;