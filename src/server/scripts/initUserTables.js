// server/scripts/initUserTables.js - ES Modules Version
import { testConnection } from '../config/database.js';
import userDbService from '../services/userDbService.js';

async function initializeUserTables() {
  try {
    console.log('🔧 Initializing user database tables...');
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    // Initialize user tables
    await userDbService.initializeTables();
    
    console.log('🎉 User database initialization completed successfully!');
    console.log('');
    console.log('✅ Tables created:');
    console.log('  - users');
    console.log('  - user_sessions');
    console.log('  - user_favorites');
    console.log('  - user_search_history');
    console.log('');
    console.log('🚀 Your user database is ready!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('  1. Add user routes to your server.js');
    console.log('  2. Update your client-side code with the auth context');
    console.log('  3. Test with: npm run dev');
    
  } catch (error) {
    console.error('❌ User database initialization failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

initializeUserTables();

// server/scripts/cleanup.js - ES Modules Version
export async function runDatabaseCleanup() {
  try {
    console.log('🧹 Starting database cleanup...');
    
    const { default: userDbService } = await import('../services/userDbService.js');
    await userDbService.cleanup();
    
    console.log('✅ Database cleanup completed!');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    throw error;
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDatabaseCleanup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

// server/scripts/testConnection.js - ES Modules Version
import { testConnection } from '../config/database.js';

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Database connection successful!');
      console.log('🎉 Your Supabase PostgreSQL database is ready.');
    } else {
      console.log('❌ Database connection failed!');
      console.log('🔧 Please check your .env configuration:');
      console.log('  - DB_HOST');
      console.log('  - DB_USER');
      console.log('  - DB_PASSWORD');
      console.log('  - DB_DATABASE');
      console.log('  - DB_PORT');
    }
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

testDatabaseConnection();

// server/scripts/createDummyUsers.js - ES Modules Version (optional)
import bcrypt from 'bcryptjs';
import userDbService from '../services/userDbService.js';

async function createDummyUsers() {
  try {
    console.log('👥 Creating dummy users for testing...');
    
    const dummyUsers = [
      {
        email: 'test@example.com',
        password: 'password123',
        fullName: '田中太郎',
        phone: '090-1234-5678',
        gender: 'male'
      },
      {
        email: 'user@test.jp',
        password: 'password123',
        fullName: '佐藤花子',
        phone: '080-9876-5432',
        gender: 'female'
      },
      {
        email: 'admin@realestate.com',
        password: 'password123',
        fullName: '管理者',
        phone: '070-1111-2222',
        gender: 'other'
      }
    ];
    
    for (const userData of dummyUsers) {
      try {
        // Check if user already exists
        const existingUser = await userDbService.findUserByEmail(userData.email);
        if (existingUser) {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
          continue;
        }
        
        // Hash password
        const passwordHash = await bcrypt.hash(userData.password, 12);
        
        // Create user
        const userId = await userDbService.createUser({
          email: userData.email,
          passwordHash,
          fullName: userData.fullName,
          phone: userData.phone,
          gender: userData.gender,
          preferredLanguage: 'ja'
        });
        
        console.log(`✅ Created user: ${userData.email} (ID: ${userId})`);
        
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.email}:`, error.message);
      }
    }
    
    console.log('');
    console.log('🎉 Dummy users creation completed!');
    console.log('');
    console.log('📝 Test login credentials:');
    dummyUsers.forEach(user => {
      console.log(`  📧 ${user.email} / 🔑 ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Dummy users creation failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDummyUsers();
}