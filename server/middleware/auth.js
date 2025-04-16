const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/server');

module.exports = {
  /**
   * Authentication middleware to verify JWT token
   */
  authenticate: (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, jwtSecret);
      
      // Add user from payload
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  },

  /**
   * Optional authentication - doesn't block the request if token is invalid
   */
  optionalAuth: (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token, continue without setting user
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, jwtSecret);
      
      // Add user from payload
      req.user = decoded;
    } catch (err) {
      // Continue without setting user if token is invalid
    }
    next();
  }
};