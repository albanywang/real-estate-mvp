// server/scripts/createDummyUsers.js
import bcrypt from 'bcryptjs';
import userDbService from '../services/userDbService.js';

async function createDummyUsers() {
  try {
    console.log('👥 Creating dummy users for testing...');
    console.log('');
    
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
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const userData of dummyUsers) {
      try {
        // Check if user already exists
        const existingUser = await userDbService.findUserByEmail(userData.email);
        if (existingUser) {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
          skippedCount++;
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
        
        console.log(`✅ Created user: ${userData.fullName} (${userData.email}) - ID: ${userId}`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.email}:`, error.message);
      }
    }
    
    console.log('');
    console.log('🎉 Dummy users creation completed!');
    console.log(`📊 Summary: ${createdCount} created, ${skippedCount} skipped`);
    console.log('');
    console.log('🔑 Test login credentials:');
    console.log('┌─────────────────────────┬─────────────────┬─────────────┐');
    console.log('│ Email                   │ Password        │ Name        │');
    console.log('├─────────────────────────┼─────────────────┼─────────────┤');
    dummyUsers.forEach(user => {
      const email = user.email.padEnd(23);
      const password = user.password.padEnd(15);
      const name = user.fullName.padEnd(11);
      console.log(`│ ${email} │ ${password} │ ${name} │`);
    });
    console.log('└─────────────────────────┴─────────────────┴─────────────┘');
    console.log('');
    console.log('🧪 Test these users with:');
    console.log('  POST http://localhost:3001/api/users/login');
    console.log('  { "email": "test@example.com", "password": "password123" }');
    
  } catch (error) {
    console.error('❌ Dummy users creation failed:', error.message);
    console.log('');
    console.log('🔧 Make sure to run this first:');
    console.log('  npm run db:init-users');
    
    process.exit(1);
  }
  
  process.exit(0);
}

createDummyUsers();