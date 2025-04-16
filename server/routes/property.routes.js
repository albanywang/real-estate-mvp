const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validateBody, validateQuery, validateParams } = require('../middleware/validation');
const Joi = require('joi');

// Validation schemas
const createPropertySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  bedrooms: Joi.number().integer().min(0).required(),
  bathrooms: Joi.number().positive().required(),
  area: Joi.number().positive().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zip_code: Joi.string().required(),
  property_type: Joi.string().required(),
  listing_type: Joi.string().valid('sale', 'rent').required(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().required(),
      is_primary: Joi.boolean().default(false)
    })
  ).optional()
});

const updatePropertySchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  bedrooms: Joi.number().integer().min(0).optional(),
  bathrooms: Joi.number().positive().optional(),
  area: Joi.number().positive().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  zip_code: Joi.string().optional(),
  property_type: Joi.string().optional(),
  listing_type: Joi.string().valid('sale', 'rent').optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional()
});

const propertyIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const nearbySchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  radius: Joi.number().positive().optional()
});

const searchSchema = Joi.object({
  query: Joi.string().required()
});

const imageSchema = Joi.object({
  image_url: Joi.string().required(),
  is_primary: Joi.boolean().default(false)
});

// Get all properties (with optional filtering)
router.get('/', optionalAuth, propertyController.getProperties);

// Create a new property
router.post('/', authenticate, validateBody(createPropertySchema), propertyController.createProperty);

// Get a property by ID
router.get('/:id', validateParams(propertyIdSchema), propertyController.getPropertyById);

// Update a property
router.put('/:id', authenticate, validateParams(propertyIdSchema), validateBody(updatePropertySchema), propertyController.updateProperty);

// Delete a property
router.delete('/:id', authenticate, validateParams(propertyIdSchema), propertyController.deleteProperty);

// Get nearby properties
router.get('/nearby', validateQuery(nearbySchema), propertyController.getNearbyProperties);

// Search properties by location
router.get('/search', validateQuery(searchSchema), propertyController.searchProperties);

// Add image to property
router.post('/:id/images', authenticate, validateParams(propertyIdSchema), validateBody(imageSchema), propertyController.addPropertyImage);

// Remove image from property
router.delete('/:id/images/:imageId', authenticate, validateParams(propertyIdSchema), propertyController.removePropertyImage);

// Set primary image for property
router.put('/:id/images/:imageId/primary', authenticate, validateParams(propertyIdSchema), propertyController.setPrimaryImage);

module.exports = router;