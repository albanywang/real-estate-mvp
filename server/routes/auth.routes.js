const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateBody } = require('../middleware/validation');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone: Joi.string().allow('').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register a new user
router.post('/register', validateBody(registerSchema), authController.register);

// Login user
router.post('/login', validateBody(loginSchema), authController.login);

// Get current user
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;