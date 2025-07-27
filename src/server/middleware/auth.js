// server/middleware/auth.js - ES Modules Version
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production';

// Generate JWT Token
export const generateToken = (userId) => {
  return jwt.sign(
    { 
      userId: userId,
      type: 'access'
    },
    JWT_SECRET,
    { 
      expiresIn: '7d', // Token expires in 7 days
      issuer: 'real-estate-app',
      audience: 'real-estate-users'
    }
  );
};

// Generate Refresh Token (for future use)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { 
      userId: userId,
      type: 'refresh'
    },
    JWT_SECRET,
    { 
      expiresIn: '30d', // Refresh token expires in 30 days
      issuer: 'real-estate-app',
      audience: 'real-estate-users'
    }
  );
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'real-estate-app',
      audience: 'real-estate-users'
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Authentication Middleware
export const authenticateToken = async (req, res, next) => {
  try {
    // Import userDbService dynamically to avoid circular imports
    const { default: userDbService } = await import('../services/userDbService.js');
    
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'アクセストークンが必要です。'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (decoded.type !== 'access') {
      return res.status(401).json({
        error: '無効なトークンタイプです。'
      });
    }

    // Get user from database
    const user = await userDbService.findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'ユーザーが見つかりません。'
      });
    }

    if (user.accountStatus !== 'active') {
      return res.status(401).json({
        error: 'アカウントが無効になっています。'
      });
    }

    // Add user info to request object
    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      accountStatus: user.accountStatus
    };

    // Update last activity
    await userDbService.updateLastActivity(user.id, req.ip, req.get('User-Agent'));

    next();

  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: '無効なトークンです。'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'トークンの有効期限が切れています。再度ログインしてください。'
      });
    }

    return res.status(500).json({
      error: '認証中にエラーが発生しました。'
    });
  }
};

// Optional Authentication Middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const { default: userDbService } = await import('../services/userDbService.js');
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyToken(token);
    const user = await userDbService.findUserById(decoded.userId);
    
    if (user && user.accountStatus === 'active') {
      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        accountStatus: user.accountStatus
      };
    } else {
      req.user = null;
    }

    next();

  } catch (error) {
    // Don't fail on optional auth errors
    req.user = null;
    next();
  }
};

// CORS Middleware (enhanced for your existing setup)
export const corsMiddleware = (req, res, next) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

// Request Logging Middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

// Error Handler Middleware
export const errorHandler = (error, req, res, next) => {
  console.error('Unhandled error:', error);

  // Database errors
  if (error.code === '23505') { // PostgreSQL unique violation
    return res.status(400).json({
      error: '重複したデータです。'
    });
  }

  if (error.code === '23503') { // PostgreSQL foreign key violation
    return res.status(400).json({
      error: '関連するデータが見つかりません。'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: '無効なトークンです。'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'トークンの有効期限が切れています。'
    });
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: '入力データが無効です。'
    });
  }

  // Default error
  res.status(500).json({
    error: 'サーバーエラーが発生しました。'
  });
};

// Security Headers Middleware (works with your helmet setup)
export const securityHeaders = (req, res, next) => {
  // Additional security headers (helmet already covers most)
  res.header('X-API-Version', '1.0');
  res.header('X-Powered-By', 'Real Estate API');
  
  next();
};