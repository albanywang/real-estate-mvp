// server/scripts/testConnection.js
import { testConnection } from '../config/database.js';

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📍 Connecting to:', {
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      port: process.env.DB_PORT
    });
    
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Database connection successful!');
      console.log('🎉 Your Supabase PostgreSQL database is ready.');
      console.log('');
      console.log('📋 Next steps:');
      console.log('  1. Run: npm run db:init-users');
      console.log('  2. Run: npm run dev');
    } else {
      console.log('❌ Database connection failed!');
      console.log('');
      console.log('🔧 Please check your .env configuration:');
      console.log('  - DB_HOST=' + process.env.DB_HOST);
      console.log('  - DB_USER=' + process.env.DB_USER);
      console.log('  - DB_PASSWORD=' + (process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]'));
      console.log('  - DB_DATABASE=' + process.env.DB_DATABASE);
      console.log('  - DB_PORT=' + process.env.DB_PORT);
      console.log('');
      console.log('💡 Make sure your Supabase database is running and accessible.');
    }
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.log('');
    console.log('🔧 Common issues:');
    console.log('  - Check your .env file exists and has correct values');
    console.log('  - Verify your Supabase database is running');
    console.log('  - Check your network connection');
    console.log('  - Ensure your IP is whitelisted in Supabase');
    
    process.exit(1);
  }
  
  process.exit(0);
}

testDatabaseConnection();