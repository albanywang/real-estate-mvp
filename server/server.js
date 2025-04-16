const app = require('./app');
const { port } = require('./config/server');
const db = require('./config/database');

// Test database connection
db.pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    process.exit(1);
  }
  console.log('Connected to database successfully');
  release();
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => {
    process.exit(1);
  });
});