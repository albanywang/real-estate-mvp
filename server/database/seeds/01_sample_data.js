const db = require('../../config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // Start a transaction
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert sample users
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const usersQuery = `
        INSERT INTO users (email, password_hash, first_name, last_name, phone)
        VALUES 
          ('john@example.com', $1, 'John', 'Doe', '(123) 456-7890'),
          ('jane@example.com', $1, 'Jane', 'Smith', '(456) 789-0123')
        ON CONFLICT (email) DO NOTHING;
      `;
      
      await client.query(usersQuery, [hashedPassword]);
      
      // Insert sample properties
      const propertiesQuery = `
        INSERT INTO properties (
          title, description, price, bedrooms, bathrooms, area,
          address, city, state, zip_code, property_type, listing_type,
          location
        )
        VALUES 
          (
            'Modern Downtown Apartment',
            'A beautiful modern apartment in the heart of downtown with stunning city views.',
            500000, 2, 2, 1200,
            '123 Main St', 'New York', 'NY', '10001', 'apartment', 'sale',
            ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)::geography
          ),
          (
            'Luxurious Family Home',
            'Spacious family home with large backyard and modern amenities.',
            850000, 4, 3, 2800,
            '456 Oak Lane', 'Brooklyn', 'NY', '11201', 'house', 'sale',
            ST_SetSRID(ST_MakePoint(-73.9496, 40.6526), 4326)::geography
          ),
          (
            'Cozy Studio Near Park',
            'Charming studio apartment located just steps away from Central Park.',
            2200, 0, 1, 500,
            '789 Park Ave', 'New York', 'NY', '10021', 'apartment', 'rent',
            ST_SetSRID(ST_MakePoint(-73.9654, 40.7829), 4326)::geography
          )
        RETURNING id;
      `;
      
      const propertiesResult = await client.query(propertiesQuery);
      const propertyIds = propertiesResult.rows.map(row => row.id);
      
      // Insert sample property images
      if (propertyIds.length > 0) {
        const imagesQuery = `
          INSERT INTO property_images (property_id, image_url, is_primary)
          VALUES 
            ($1, 'https://via.placeholder.com/800x600?text=Apartment+1', true),
            ($1, 'https://via.placeholder.com/800x600?text=Apartment+2', false),
            ($2, 'https://via.placeholder.com/800x600?text=House+1', true),
            ($2, 'https://via.placeholder.com/800x600?text=House+2', false),
            ($3, 'https://via.placeholder.com/800x600?text=Studio+1', true);
        `;
        
        await client.query(imagesQuery, [propertyIds[0], propertyIds[1], propertyIds[2]]);
        
        // Insert sample saved properties
        const savedPropertiesQuery = `
          INSERT INTO saved_properties (user_id, property_id)
          VALUES 
            (1, $1),
            (1, $2);
        `;
        
        await client.query(savedPropertiesQuery, [propertyIds[0], propertyIds[2]]);
      }
      
      await client.query('COMMIT');
      console.log('Database seeded successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error seeding database:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
}

// Run the seeding function
seedDatabase();