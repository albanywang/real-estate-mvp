const Joi = require('joi');

// Base schemas for reuse
const addressSchema = {
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().length(2).required(),
  zip_code: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required()
};

const coordinatesSchema = {
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
};

// Validation schemas
module.exports = {
  // User schemas
  registerSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9()-\s]+$/).allow('').optional()
  }),
  
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  updateProfileSchema: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9()-\s]+$/).allow('').optional(),
    current_password: Joi.string().optional(),
    new_password: Joi.string().min(6).optional()
  }).with('new_password', 'current_password'),
  
  // Property schemas
  createPropertySchema: Joi.object({
    title: Joi.string().max(255).required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    bedrooms: Joi.number().integer().min(0).required(),
    bathrooms: Joi.number().positive().required(),
    area: Joi.number().positive().required(),
    ...addressSchema,
    property_type: Joi.string().valid('house', 'apartment', 'condo', 'townhouse').required(),
    listing_type: Joi.string().valid('sale', 'rent').required(),
    ...coordinatesSchema
  }),
  
  updatePropertySchema: Joi.object({
    title: Joi.string().max(255).optional(),
    description: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    bedrooms: Joi.number().integer().min(0).optional(),
    bathrooms: Joi.number().positive().optional(),
    area: Joi.number().positive().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().length(2).optional(),
    zip_code: Joi.string().pattern(/^\d{5}(-\d{4})?$/).optional(),
    property_type: Joi.string().valid('house', 'apartment', 'condo', 'townhouse').optional(),
    listing_type: Joi.string().valid('sale', 'rent').optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional()
  }),
  
  propertyIdSchema: Joi.object({
    id: Joi.number().integer().positive().required()
  }),
  
  // Image schemas
  imageSchema: Joi.object({
    image_url: Joi.string().uri().required(),
    is_primary: Joi.boolean().default(false)
  }),
  
  // Search and filter schemas
  searchSchema: Joi.object({
    query: Joi.string().required()
  }),
  
  propertyFiltersSchema: Joi.object({
    location: Joi.string().optional(),
    type: Joi.string().valid('house', 'apartment', 'condo', 'townhouse').optional(),
    status: Joi.string().valid('sale', 'rent', 'any').optional(),
    priceMin: Joi.number().positive().optional(),
    priceMax: Joi.number().positive().greater(Joi.ref('priceMin')).optional(),
    bedrooms: Joi.number().integer().min(0).optional(),
    bathrooms: Joi.number().positive().optional()
  }),
  
  nearbySchema: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    radius: Joi.number().positive().default(5000).optional() // Default 5km
  }),
  
  // Pagination schema
  paginationSchema: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),
  
  // Sorting schema
  sortingSchema: Joi.object({
    sort_by: Joi.string().valid('price', 'date', 'beds', 'baths', 'area').default('date'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),
  
  // Combine common query parameters
  querySchema: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    sort_by: Joi.string().valid('price', 'date', 'beds', 'baths', 'area').default('date'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    location: Joi.string().optional(),
    type: Joi.string().valid('house', 'apartment', 'condo', 'townhouse').optional(),
    status: Joi.string().valid('sale', 'rent', 'any').optional(),
    priceMin: Joi.number().positive().optional(),
    priceMax: Joi.number().positive().greater(Joi.ref('priceMin')).optional(),
    bedrooms: Joi.number().integer().min(0).optional(),
    bathrooms: Joi.number().positive().optional()
  }),
  
  // Helper validation functions
  validateEmail: (email) => {
    const schema = Joi.string().email().required();
    const { error } = schema.validate(email);
    return !error;
  },
  
  validatePassword: (password) => {
    const schema = Joi.string().min(6).required();
    const { error } = schema.validate(password);
    return !error;
  },
  
  validatePhone: (phone) => {
    const schema = Joi.string().pattern(/^[0-9()-\s]+$/).allow('');
    const { error } = schema.validate(phone);
    return !error;
  },
  
  validateZipCode: (zipCode) => {
    const schema = Joi.string().pattern(/^\d{5}(-\d{4})?$/);
    const { error } = schema.validate(zipCode);
    return !error;
  },
  
  validateLatitude: (lat) => {
    const schema = Joi.number().min(-90).max(90);
    const { error } = schema.validate(lat);
    return !error;
  },
  
  validateLongitude: (lng) => {
    const schema = Joi.number().min(-180).max(180);
    const { error } = schema.validate(lng);
    return !error;
  },
  
  validatePrice: (price) => {
    const schema = Joi.number().positive();
    const { error } = schema.validate(price);
    return !error;
  }
};