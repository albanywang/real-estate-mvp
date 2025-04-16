-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  bedrooms SMALLINT,
  bathrooms SMALLINT,
  area DECIMAL(10, 2),
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  property_type VARCHAR(50) NOT NULL,
  listing_type VARCHAR(50) NOT NULL,
  -- PostGIS geography column for location
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create property images table
CREATE TABLE IF NOT EXISTS property_images (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create saved properties table
CREATE TABLE IF NOT EXISTS saved_properties (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Create PostGIS extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create indexes for performance
CREATE INDEX idx_properties_location ON properties USING GIST (location);
CREATE INDEX idx_properties_city ON properties (city);
CREATE INDEX idx_properties_type ON properties (property_type);
CREATE INDEX idx_properties_listing_type ON properties (listing_type);
CREATE INDEX idx_properties_price ON properties (price);
CREATE INDEX idx_property_images_property_id ON property_images (property_id);
CREATE INDEX idx_saved_properties_user_id ON saved_properties (user_id);