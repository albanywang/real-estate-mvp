// server/scripts/cleanup.js
import userDbService from '../services/userDbService.js';

async function runDatabaseCleanup() {
  try {
    console.log('🧹 Starting database cleanup...');
    console.log('');
    
    // Clean up expired sessions
    console.log('🔄 Cleaning up expired sessions...');
    
    // Clean up old search history (keep last 100 per user)
    console.log('🔄 Cleaning up old search history...');
    
    // Run the cleanup
    await userDbService.cleanup();
    
    console.log('');
    console.log('✅ Database cleanup completed successfully!');
    console.log('');
    console.log('📊 Cleanup summary:');
    console.log('  - Removed expired user sessions');
    console.log('  - Cleaned up old search history (kept last 100 per user)');
    console.log('  - Database optimized for better performance');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
    console.log('');
    console.log('🔧 Possible issues:');
    console.log('  - Database connection problem');
    console.log('  - Missing user tables (run: npm run db:init-users)');
    console.log('  - Permission issues');
    
    process.exit(1);
  }
  
  process.exit(0);
}

runDatabaseCleanup();