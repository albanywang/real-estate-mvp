/**
 * Simplified Real Estate MVP - Sample Data Generator
 * 
 * This script generates realistic sample data for a real estate application
 * with improved error handling and progress logging.
 */

const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'real_estate_mvp',
  password: '7488', // Change this to your actual password
  port: 5432,
});

// Configuration for sample data generation
const config = {
  usersCount: 20,         // Reduced count for testing
  propertiesCount: 10,    // Reduced count for testing
  featuresCount: 10,
  propertyTypesCount: 5,
  neighborhoodsCount: 5,
  // Geographic boundaries for property locations (San Francisco area)
  boundaries: {
    minLat: 37.71,
    maxLat: 37.81,
    minLng: -122.51,
    maxLng: -122.38
  }
};

// Helper function to limit string length for database fields
function limitLength(str, maxLength) {
  if (!str) return str;
  return str.substring(0, maxLength);
}

// Helper to generate a random number within a range
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to generate a random price within a range with more realistic distribution
const generatePrice = () => {
  const basePrice = randomInRange(300000, 2500000);
  return Math.round(basePrice / 10000) * 10000; // Round to nearest 10k
};

// Helper to generate a random date within the last year
const generateDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - randomInRange(0, 1));
  date.setMonth(randomInRange(0, 11));
  date.setDate(randomInRange(1, 28));
  return date;
};

// Helper to generate a random point within the specified boundaries
const generatePoint = (bounds) => {
  const lat = bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat);
  const lng = bounds.minLng + Math.random() * (bounds.maxLng - bounds.minLng);
  return { lat, lng };
};

// Generate and insert property types
async function insertPropertyTypes() {
  console.log('Inserting property types...');
  const propertyTypes = [
    'Single Family Home',
    'Condo',
    'Townhouse',
    'Multi-Family',
    'Apartment',
    'Vacant Land',
    'Commercial'
  ];

  try {
    // Clear existing data
    await pool.query('TRUNCATE property_types CASCADE');
    console.log('Cleared existing property types');
    
    // Insert property types
    for (const type of propertyTypes) {
      await pool.query(
        'INSERT INTO property_types (name) VALUES ($1)',
        [type]
      );
    }
    
    console.log(`Added ${propertyTypes.length} property types`);
  } catch (error) {
    console.error('Error inserting property types:', error);
    throw error;
  }
}

// Generate and insert features
async function insertFeatures() {
  console.log('Inserting property features...');
  const features = [
    'Garage',
    'Swimming Pool',
    'Fireplace',
    'Garden',
    'Air Conditioning',
    'Hardwood Floors',
    'Balcony',
    'Laundry Room',
    'Walk-in Closet',
    'Stainless Steel Appliances',
    'Smart Home Features',
    'Solar Panels',
    'EV Charging Station',
    'Home Office',
    'Gym'
  ];

  try {
    // Clear existing data
    await pool.query('TRUNCATE features CASCADE');
    console.log('Cleared existing features');
    
    // Insert features
    for (const feature of features) {
      await pool.query(
        'INSERT INTO features (name) VALUES ($1)',
        [feature]
      );
    }
    
    console.log(`Added ${features.length} features`);
  } catch (error) {
    console.error('Error inserting features:', error);
    throw error;
  }
}

// Generate and insert neighborhoods
async function insertNeighborhoods() {
  console.log('Inserting neighborhoods...');
  
  // San Francisco neighborhoods with approximate boundaries
  const neighborhoods = [
    { name: 'Mission District', city: 'San Francisco', state: 'CA', zip_code: '94110', 
      center: { lat: 37.7598, lng: -122.4148 } },
    { name: 'SoMa', city: 'San Francisco', state: 'CA', zip_code: '94103', 
      center: { lat: 37.7785, lng: -122.4056 } },
    { name: 'Marina', city: 'San Francisco', state: 'CA', zip_code: '94123', 
      center: { lat: 37.8015, lng: -122.4368 } },
    { name: 'Pacific Heights', city: 'San Francisco', state: 'CA', zip_code: '94115', 
      center: { lat: 37.7925, lng: -122.4382 } },
    { name: 'Nob Hill', city: 'San Francisco', state: 'CA', zip_code: '94109', 
      center: { lat: 37.7928, lng: -122.4143 } }
  ];

  try {
    // Clear existing data
    await pool.query('TRUNCATE neighborhoods CASCADE');
    console.log('Cleared existing neighborhoods');
    
    // Insert neighborhoods with simplified polygon boundaries
    for (const neighborhood of neighborhoods) {
      // Create a simple circular boundary around the center point (simplified for the example)
      // In a real application, you'd use actual neighborhood boundaries
      const radius = 0.01; // approximately 1.1 km
      const boundaryPoints = [];
      
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const lat = neighborhood.center.lat + Math.cos(angle) * radius;
        const lng = neighborhood.center.lng + Math.sin(angle) * radius;
        boundaryPoints.push(`${lng} ${lat}`);
      }
      
      // Close the polygon by repeating the first point
      boundaryPoints.push(boundaryPoints[0]);
      
      const polygonWKT = `POLYGON((${boundaryPoints.join(',')}))`;
      
      await pool.query(
        `INSERT INTO neighborhoods (name, city, state, zip_code, boundary) 
         VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326))`,
        [
          limitLength(neighborhood.name, 100), 
          limitLength(neighborhood.city, 100), 
          limitLength(neighborhood.state, 50), 
          limitLength(neighborhood.zip_code, 20), 
          polygonWKT
        ]
      );
    }
    
    console.log(`Added ${neighborhoods.length} neighborhoods`);
  } catch (error) {
    console.error('Error inserting neighborhoods:', error);
    throw error;
  }
}

// Generate and insert users
async function insertUsers() {
  console.log('Inserting users...');
  
  try {
    // Clear existing data
    await pool.query('TRUNCATE users CASCADE');
    console.log('Cleared existing users');
    
    const userTypes = ['buyer', 'seller', 'agent', 'admin'];
    const saltRounds = 10;
    
    for (let i = 0; i < config.usersCount; i++) {
      const firstName = limitLength(faker.person.firstName(), 100);
      const lastName = limitLength(faker.person.lastName(), 100);
      const email = limitLength(faker.internet.email({ firstName, lastName }).toLowerCase(), 255);
      const password = await bcrypt.hash('password123', saltRounds); // In production, use secure passwords
      const phone = limitLength(faker.phone.number('###-###-####'), 20);
      const userType = userTypes[randomInRange(0, userTypes.length - 1)];
      
      await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [email, password, firstName, lastName, phone, userType]
      );
      console.log(`Added user ${i+1}/${config.usersCount}: ${firstName} ${lastName} (${userType})`);
    }
    
    console.log(`Added ${config.usersCount} users`);
  } catch (error) {
    console.error('Error inserting users:', error);
    throw error;
  }
}

// Generate and insert properties with images and features
async function insertProperties() {
  console.log('Starting property insertion...');
  
  try {
    // Clear existing data
    await pool.query('TRUNCATE properties CASCADE');
    await pool.query('TRUNCATE property_images CASCADE');
    await pool.query('TRUNCATE property_features CASCADE');
    await pool.query('TRUNCATE property_views CASCADE');
    await pool.query('TRUNCATE saved_properties CASCADE');
    console.log('Cleared existing property data');
  } catch (err) {
    console.error('Error clearing property tables:', err);
    throw err;
  }
  
  // Get all property types, neighborhoods, features, and users for reference
  console.log('Fetching reference data...');
  let propertyTypes, neighborhoods, features, users, agents, sellers, buyers;
  
  try {
    const typesResult = await pool.query('SELECT type_id FROM property_types');
    propertyTypes = typesResult.rows;
    
    const neighborhoodsResult = await pool.query('SELECT neighborhood_id, name FROM neighborhoods');
    neighborhoods = neighborhoodsResult.rows;
    
    const featuresResult = await pool.query('SELECT feature_id FROM features');
    features = featuresResult.rows;
    
    const usersResult = await pool.query('SELECT user_id, user_type FROM users');
    users = usersResult.rows;
    
    // Filter users by type
    agents = users.filter(user => user.user_type === 'agent');
    sellers = users.filter(user => user.user_type === 'seller');
    buyers = users.filter(user => user.user_type === 'buyer');
    
    console.log(`Reference data: ${propertyTypes.length} property types, ${neighborhoods.length} neighborhoods, ${features.length} features`);
    console.log(`Users: ${agents.length} agents, ${sellers.length} sellers, ${buyers.length} buyers`);
  } catch (err) {
    console.error('Error fetching reference data:', err);
    throw err;
  }
  
  const statuses = ['for_sale', 'pending', 'sold', 'for_rent', 'rented'];
  let successCount = 0;
  
  // Process one property at a time to avoid overwhelming the database
  for (let i = 0; i < config.propertiesCount; i++) {
    try {
      console.log(`\nProcessing property ${i + 1} of ${config.propertiesCount}`);
      
      // Select a random neighborhood
      const neighborhood = neighborhoods[randomInRange(0, neighborhoods.length - 1)];
      
      // Generate a random point within the neighborhood (simplified)
      const point = generatePoint(config.boundaries);
      
      // Basic property details
      const bedrooms = randomInRange(1, 6);
      const bathrooms = randomInRange(1, 5) + (Math.random() > 0.5 ? 0.5 : 0);
      const squareFeet = randomInRange(600, 4000);
      const lotSize = randomInRange(squareFeet, squareFeet * 3) / 43560; // Convert to acres
      const yearBuilt = randomInRange(1900, 2023);
      
      // Select random property type
      const propertyTypeId = propertyTypes[randomInRange(0, propertyTypes.length - 1)].type_id;
      
      // Select random status
      const status = statuses[randomInRange(0, statuses.length - 1)];
      
      // Select random agent and owner
      const agentId = agents[randomInRange(0, agents.length - 1)].user_id;
      const ownerId = sellers[randomInRange(0, sellers.length - 1)].user_id;
      
      // Generate price based on size, bedrooms, etc.
      const basePrice = generatePrice();
      const price = Math.round((basePrice * (0.8 + (bedrooms * 0.1) + (squareFeet / 20000))) / 1000) * 1000;
      
      // Generate address - ensure it's not too long
      const streetAddress = limitLength(faker.location.streetAddress(), 254);
      const { name: neighborhoodName } = neighborhood;
      
      // Create property title - ensure it's not too long
      const propertyTypeName = ["Home", "Condo", "Townhouse", "Property"][randomInRange(0, 3)];
      const title = limitLength(`${bedrooms} BR ${bathrooms} BA ${propertyTypeName} in ${neighborhoodName}`, 254);
      
      // Create description - ensure it's not too long
      const featuresList = [
        `${bedrooms} bedroom${bedrooms > 1 ? 's' : ''}`,
        `${bathrooms} bathroom${bathrooms > 1 ? 's' : ''}`,
        `${squareFeet} square feet`,
        `Built in ${yearBuilt}`
      ];
      
      const amenities = [
        'modern kitchen',
        'hardwood floors',
        'natural light',
        'updated appliances',
        'walk-in closets',
        'spacious backyard',
        'granite countertops',
        'central heating',
        'central air conditioning',
        'close to public transportation',
        'close to schools',
        'close to shopping'
      ];
      
      // Shuffle and take a subset of amenities
      const selectedAmenities = [...amenities]
        .sort(() => 0.5 - Math.random())
        .slice(0, randomInRange(3, 6));
      
      const description = limitLength(
        `Beautiful ${featuresList.join(', ')} featuring ${selectedAmenities.join(', ')}. ` +
        `Located in the desirable ${neighborhoodName} neighborhood. ` +
        faker.lorem.paragraph(randomInRange(2, 4)),
        4000 // TEXT type can hold a lot, but let's be reasonable
      );
      
      // Prepare a zip code that fits in VARCHAR(20)
      const zipCode = limitLength(
        neighborhood.name.includes('District') ? '941' + randomInRange(10, 30) : '941' + randomInRange(0, 33),
        20
      );
      
      console.log(`Inserting property ${i + 1} into database...`);
      
      // Insert the property
      const propertyResult = await pool.query(
        `INSERT INTO properties (
          title, description, price, bedrooms, bathrooms, square_feet, lot_size, 
          year_built, property_type_id, neighborhood_id, street_address, city, 
          state, zip_code, status, listing_date, owner_id, agent_id, location
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'San Francisco', 'CA', 
          $12, $13, $14, $15, $16, ST_SetSRID(ST_MakePoint($17, $18), 4326)
        ) RETURNING property_id`,
        [
          title, description, price, bedrooms, bathrooms, squareFeet, lotSize,
          yearBuilt, propertyTypeId, neighborhood.neighborhood_id, streetAddress,
          zipCode, status, generateDate().toISOString().split('T')[0], ownerId, agentId,
          point.lng, point.lat
        ]
      );
      
      const propertyId = propertyResult.rows[0].property_id;
      console.log(`Successfully inserted property ${i + 1} with ID ${propertyId}`);
      
      // Add images for the property - simplified to avoid issues
      console.log(`Adding images for property ${i + 1}`);
      const imageCount = 3; // Fixed small number to reduce complexity
      
      for (let j = 0; j < imageCount; j++) {
        try {
          // Use a simple, consistent URL pattern
          const imageUrl = limitLength(`https://example.com/property/${propertyId}/image${j+1}.jpg`, 255);
          const isPrimary = (j === 0); // First image is primary
          
          await pool.query(
            `INSERT INTO property_images (property_id, image_url, caption, is_primary) 
             VALUES ($1, $2, $3, $4)`,
            [propertyId, imageUrl, limitLength(`Image ${j + 1} of property`, 255), isPrimary]
          );
        } catch (imgErr) {
          console.error(`Error adding image ${j + 1}:`, imgErr);
          // Continue with next image
        }
      }
      
      // Add features for the property - simplified
      console.log(`Adding features for property ${i + 1}`);
      const featureCount = randomInRange(2, 5); // Reduced count
      const selectedFeatures = new Set();
      
      // Add random features
      while (selectedFeatures.size < featureCount && selectedFeatures.size < features.length) {
        const featureId = features[randomInRange(0, features.length - 1)].feature_id;
        if (!selectedFeatures.has(featureId)) {
          selectedFeatures.add(featureId);
          
          try {
            await pool.query(
              `INSERT INTO property_features (property_id, feature_id) 
               VALUES ($1, $2)`,
              [propertyId, featureId]
            );
          } catch (featErr) {
            console.error(`Error adding feature:`, featErr);
            // Continue with next feature
          }
        }
      }
      
      // Add a few property views
      console.log(`Adding views for property ${i + 1}`);
      const viewCount = randomInRange(1, 5); // Reduced count
      
      for (let v = 0; v < viewCount; v++) {
        try {
          const viewerId = buyers[randomInRange(0, buyers.length - 1)].user_id;
          const viewDate = new Date();
          viewDate.setDate(viewDate.getDate() - randomInRange(0, 30));
          
          await pool.query(
            `INSERT INTO property_views (property_id, user_id, viewed_at, ip_address)
             VALUES ($1, $2, $3, $4)`,
            [propertyId, viewerId, viewDate.toISOString(), limitLength(faker.internet.ip(), 50)]
          );
        } catch (viewErr) {
          console.error(`Error adding view:`, viewErr);
          // Continue with next view
        }
      }
      
      // Occasionally add a saved property
      if (Math.random() > 0.7) {
        try {
          console.log(`Adding saved property entry for property ${i + 1}`);
          const saverId = buyers[randomInRange(0, buyers.length - 1)].user_id;
          const saveDate = new Date();
          
          await pool.query(
            `INSERT INTO saved_properties (user_id, property_id, saved_at)
             VALUES ($1, $2, $3)`,
            [saverId, propertyId, saveDate.toISOString()]
          );
        } catch (saveErr) {
          console.error(`Error adding saved property:`, saveErr);
          // Continue anyway
        }
      }
      
      successCount++;
      console.log(`Successfully completed property ${i + 1}. Progress: ${successCount}/${config.propertiesCount}`);
      
    } catch (propErr) {
      console.error(`Error processing property ${i + 1}:`, propErr);
      // Continue with next property
    }
  }
  
  console.log(`\nProperty insertion completed. Successfully added ${successCount} out of ${config.propertiesCount} properties.`);
}

// Main function to run the data generation
async function generateData() {
  try {
    console.log('Starting data generation...');
    
    // Generate data in order to maintain referential integrity
    await insertPropertyTypes();
    await insertFeatures();
    await insertNeighborhoods();
    await insertUsers();
    await insertProperties();
    
    console.log('Data generation completed successfully!');
  } catch (error) {
    console.error('Error generating data:', error);
  } finally {
    try {
      await pool.end();
      console.log('Database connection closed.');
    } catch (err) {
      console.error('Error closing database connection:', err);
    }
  }
}

// Run the data generation
generateData();