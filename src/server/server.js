// server/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

// Import your custom modules
import PropertyRepository from './data/PropertyRepository.js';
import PropertyService from './api/PropertyService.js';
import PropertyRoutes from './routes/PropertyRoutes.js';

// Initialize environment variables first
dotenv.config();

// Get dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Server Class - Encapsulates server setup and configuration
 */
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.env = process.env.NODE_ENV || 'development';

    // Initialize repositories, services, and routes
    this.propertyRepo = null;
    this.propertyService = null;
    this.PropertyRoutes = null;
    this.server = null;

    // Bind methods
    this.gracefulShutdown = this.gracefulShutdown.bind(this);
  }

  /**
   * Initialize database connections and repositories
   */
  async initializeRepositories() {
    try {
      console.log('🔧 Initializing repositories...');

      // Initialize repository
      this.propertyRepo = new PropertyRepository();

      // Test database connection
      await this.testDatabaseConnection();

      console.log('✅ Repositories initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize repositories:', error);
      throw error;
    }
  }

  /**
   * Initialize services layer
   */
  async initializeServices() {
    try {
      console.log('🔧 Initializing services...');

      if (!this.propertyRepo) {
        throw new Error('PropertyRepository must be initialized before services');
      }

      // Initialize service with repository
      this.propertyService = new PropertyService(this.propertyRepo);

      // Validate service is properly set up
      if (!this.propertyService.isRepositoryAvailable()) {
        throw new Error('PropertyService repository validation failed');
      }

      console.log('✅ Services initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize services:', error);
      throw error;
    }
  }

  /**
   * Test database connection
   */
  async testDatabaseConnection() {
    try {
      const pool = this.propertyRepo.getPool();
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('✅ Database connection successful');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Setup middleware
   */
  setupMiddleware() {
    console.log('🔧 Setting up middleware...');

    // Security middleware
    if (this.env === 'production') {
      this.app.use(helmet({
        crossOriginEmbedderPolicy: false, // Allow images to load
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        },
      }));
    }

    // Compression for production
    if (this.env === 'production') {
      this.app.use(compression());
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: this.env === 'production' ? 100 : 1000, // Limit each IP
      message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // CORS configuration
    const corsOptions = {
      origin: this.env === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') || false
        : true,
      credentials: true,
      optionsSuccessStatus: 200
    };
    this.app.use(cors(corsOptions));

    // Body parsing
    this.app.use(express.json({
      limit: '10mb',
      verify: (req, res, buf) => {
        try {
          JSON.parse(buf);
        } catch (e) {
          res.status(400).json({
            success: false,
            error: 'Invalid JSON format'
          });
          throw new Error('Invalid JSON');
        }
      }
    }));

    this.app.use(express.urlencoded({
      extended: true,
      limit: '10mb'
    }));

    // Request logging in development
    if (this.env === 'development') {
      this.app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp} - ${req.method} ${req.path}`);
        next();
      });
    }

    console.log('✅ Middleware setup complete');
  }

  /**
   * Setup static file serving
   */
  async setupStaticFiles() {
    console.log('🔧 Setting up static file serving...');

    // Create public/images directory if it doesn't exist
    const imagesDir = path.join(__dirname, 'public', 'images');
    try {
      await fs.access(imagesDir);
    } catch {
      await fs.mkdir(imagesDir, { recursive: true });
      console.log('📁 Created images directory');
    }

    // Serve static files
    this.app.use(express.static(path.join(__dirname, 'public'), {
      maxAge: this.env === 'production' ? '1y' : 0,
      etag: true,
      lastModified: true
    }));

    // Serve images with proper headers and debugging
    this.app.use('/images', express.static(path.join(__dirname, 'public', 'images'), {
      maxAge: this.env === 'production' ? '30d' : 0,
      setHeaders: (res, filePath) => {
        // Set proper content type for images
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp'
        };

        if (mimeTypes[ext]) {
          res.setHeader('Content-Type', mimeTypes[ext]);
        }

        // Cache control
        if (this.env === 'production') {
          res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
        }
      }
    }));

    // Development image debugging middleware
    if (this.env === 'development') {
      this.app.use((req, res, next) => {
        if (req.path.includes('/images/')) {
          console.log('🖼️  Image request received:', req.path);

          // Check if file exists asynchronously
          const imagePath = path.join(__dirname, 'public', req.path);
          fs.access(imagePath)
            .then(() => {
              console.log('✅ Image found at:', imagePath);
            })
            .catch(() => {
              console.error('❌ Image not found at:', imagePath);
            });
        }
        next();
      });
    }

    console.log('✅ Static file serving setup complete');
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    console.log('🔧 Setting up API routes...');

    if (!this.propertyService) {
      throw new Error('PropertyService must be initialized before routes');
    }

    // Initialize routes with repository and service
    console.log('Initializing PropertyRoutes with service...');
    this.PropertyRoutes = new PropertyRoutes(this.propertyRepo, this.propertyService);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: this.env,
        uptime: process.uptime(),
        database: this.propertyRepo ? 'connected' : 'disconnected',
        services: {
          propertyService: this.propertyService ? 'available' : 'unavailable'
        }
      });
    });

    // API info endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'Real Estate API',
        version: '1.0.0',
        environment: this.env,
        endpoints: {
          properties: '/api/properties',
          health: '/health',
          documentation: '/api/docs'
        },
        features: [
          'Property CRUD operations',
          'Advanced search and filtering',
          'Image upload support',
          'Market statistics',
          'Business logic validation'
        ]
      });
    });

    // API documentation endpoint
    this.app.get('/api/docs', (req, res) => {
      res.json({
        success: true,
        documentation: {
          'GET /api/properties': 'List all properties with filtering',
          'GET /api/properties/search': 'Advanced property search',
          'GET /api/properties/:id': 'Get single property by ID',
          'POST /api/properties': 'Create new property',
          'PUT /api/properties/:id': 'Update existing property',
          'DELETE /api/properties/:id': 'Delete property',
          'GET /api/properties/statistics': 'Get market statistics',
          'GET /api/properties/layouts': 'Get available layouts',
          'GET /api/properties/property-types': 'Get available property types',
          'GET /api/properties/enums': 'Get all enum values for frontend'
        }
      });
    });

    // Property routes
    this.app.use('/api/properties', this.PropertyRoutes.getRouter());

    console.log('✅ API routes setup complete');
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    console.log('🔧 Setting up error handling...');

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method,
        availableEndpoints: {
          api: '/api',
          properties: '/api/properties',
          health: '/health',
          docs: '/api/docs'
        }
      });
    });

    // Global error handler
    this.app.use((error, req, res, next) => {
      console.error('Global error handler:', error);

      // Don't expose error details in production
      const isDevelopment = this.env === 'development';

      res.status(error.status || 500).json({
        success: false,
        error: isDevelopment ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
        ...(isDevelopment && {
          stack: error.stack,
          details: error
        })
      });
    });

    console.log('✅ Error handling setup complete');
  }

  /**
   * Setup graceful shutdown
   */
  setupGracefulShutdown() {
    // Handle shutdown signals
    process.on('SIGTERM', this.gracefulShutdown);
    process.on('SIGINT', this.gracefulShutdown);

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.gracefulShutdown(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.gracefulShutdown(1);
    });
  }

  /**
   * Graceful shutdown handler
   */
  async gracefulShutdown(exitCode = 0) {
    console.log('🔄 Starting graceful shutdown...');

    try {
      // Close server
      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
        console.log('✅ HTTP server closed');
      }

      // Close database connections
      if (this.propertyRepo) {
        await this.propertyRepo.close();
        console.log('✅ Database connections closed');
      }

      console.log('✅ Graceful shutdown complete');
      process.exit(exitCode);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }

  /**
   * Start the server
   */
  async start() {
    try {
      console.log('🚀 Starting Real Estate API Server...');
      console.log(`📍 Environment: ${this.env}`);
      console.log(`📍 Port: ${this.port}`);

      // Initialize everything in correct order
      await this.initializeRepositories();
      await this.initializeServices();

      // Setup everything
      this.setupMiddleware();
      await this.setupStaticFiles();
      this.setupRoutes();
      this.setupErrorHandling();
      this.setupGracefulShutdown();

      // Start server
      this.server = this.app.listen(this.port, () => {
        console.log('🎉 Server started successfully!');
        console.log(`📍 Server running on http://localhost:${this.port}`);
        console.log(`📍 API available at http://localhost:${this.port}/api`);
        console.log(`📍 Health check at http://localhost:${this.port}/health`);
        console.log(`📍 Documentation at http://localhost:${this.port}/api/docs`);

        if (this.env === 'development') {
          console.log('🔧 Development mode - Debug logging enabled');
          console.log('🖼️  Image debugging enabled for /images/ requests');
        }
      });

      // Handle server errors
      this.server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`❌ Port ${this.port} is already in use`);
        } else {
          console.error('❌ Server error:', error);
        }
        process.exit(1);
      });

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Get Express app instance (for testing)
   */
  getApp() {
    return this.app;
  }
}

// Start server instance
const server = new Server();
server.start().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

// Export the Server class for testing purposes
export default Server;
