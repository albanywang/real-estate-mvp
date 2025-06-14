// api/PropertyService.js
/**
 * PropertyService - Business logic layer for property operations
 * Contains the logic for handling requests (e.g., validating input, querying the database, or processing property data)
 * It acts as an intermediary between routes (Controller) and the Model, 
 * encapsulating logic like validation or data processing.
 */
import {
  Property,
  PropertySearch,
  PropertyCollection,
  PropertyStatistics,
  PropertyFactory,
  PropertyValidators,
  PropertyEnums
} from '../models/index.js';

import { Pool } from 'pg';

class PropertyService {
  /**
   * Create PropertyService instance
   * @param {Object} propertyRepository - PropertyRepository instance
   */
  constructor(propertyRepository) {
    if (!propertyRepository) {
      throw new Error('PropertyRepository is required');
    }
    
    // Explicitly set the repository property
    this.propertyRepo = propertyRepository;
    
    // Initialize database pool
    this.db = this.propertyRepo.getPool();
    if (!this.db) {
      console.warn('PropertyRepository.getPool() returned null, creating new Pool');
      this.db = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
      });
    }

    // Bind methods to ensure 'this' context
    this.getAllProperties = this.getAllProperties.bind(this);
    this.searchProperties = this.searchProperties.bind(this);
    this.getPropertyById = this.getPropertyById.bind(this);
    this.createProperty = this.createProperty.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.deleteProperty = this.deleteProperty.bind(this);
    this.getPropertyStatistics = this.getPropertyStatistics.bind(this);
    this.getAvailableOptions = this.getAvailableOptions.bind(this);
    this.filterProperties = this.filterProperties.bind(this);
    this.searchLocations = this.searchLocations.bind(this);
    this.getPropertiesByLocation = this.getPropertiesByLocation.bind(this);
    this.getPopularLocations = this.getPopularLocations.bind(this);

    // Test database connection
    this.testConnection();

  }

  async testConnection() {
    try {
      const result = await this.db.query('SELECT NOW()');
      console.log('✅ PropertyService DB connection successful:', result.rows[0]);
    } catch (error) {
      console.error('❌ PropertyService DB connection failed:', error);
      throw error;
    }
  }

  /**
   * Get the repository instance (for testing or direct access)
   * @returns {Object} PropertyRepository instance
   */
  getRepository() {
    return this.propertyRepo;
  }

  /**
   * Check if repository is properly initialized
   * @returns {boolean} True if repository is available
   */
  isRepositoryAvailable() {
    return this.propertyRepo && typeof this.propertyRepo === 'object';
  }

  /**
   * Validate that repository has all required methods
   * @private
   * @throws {Error} If repository is missing required methods
   */
  validateRepository() {
    const requiredMethods = [
      'search', 'findById', 'create', 'update', 'delete', 
      'getStatistics', 'getDistinctLayouts', 'getDistinctPropertyTypes', 
      'filter', 'exists'
    ];

    for (const method of requiredMethods) {
      if (!this.propertyRepo[method] || typeof this.propertyRepo[method] !== 'function') {
        throw new Error(`PropertyRepository is missing required method: ${method}`);
      }
    }
  }

  /**
   * Get all properties with filtering, sorting, and pagination
   * @param {Object} filterParams - Filter and pagination parameters
   * @returns {Promise<Object>} Properties with pagination and summary
   */
  async getAllProperties(filterParams = {}) {
    try {
      // Validate repository is available
      if (!this.isRepositoryAvailable()) {
        throw new Error('PropertyRepository is not available');
      }

      // Validate repository methods
      this.validateRepository();

      // Create and validate search parameters
      const search = new PropertySearch(filterParams);
      const validation = search.validate();
      
      if (!validation.isValid) {
        throw new Error(`Invalid search parameters: ${validation.errors.join(', ')}`);
      }

      // Get properties from repository
      const result = await this.propertyRepo.search(search.toSearchParams());
      
      // Ensure result is properly structured
      if (!result || !Array.isArray(result.properties)) {
        throw new Error('Invalid response from repository');
      }

      // Create property instances with business logic
      const properties = result.properties.map(propData => {
        const property = new Property(propData);
        return this.enrichPropertyData(property);
      });

      // Create collection with enhanced data
      const collection = new PropertyCollection(properties, result.pagination);

      return {
        properties: collection.properties.map(prop => prop.toJSON()),
        pagination: collection.pagination,
        summary: collection.getSummary(),
        searchCriteria: search.toSearchParams()
      };

    } catch (error) {
      console.error('Error in PropertyService.getAllProperties:', error);
      throw new Error(`Failed to get properties: ${error.message}`);
    }
  }

  /**
   * Advanced property search with enhanced filtering
   * @param {Object} searchParams - Advanced search parameters
   * @returns {Promise<Object>} Search results with analytics
   */
  async searchProperties(searchParams = {}) {
    try {
      // Create search object with validation
      const search = new PropertySearch(searchParams);
      const validation = search.validate();
      
      if (!validation.isValid) {
        throw new Error(`Invalid search parameters: ${validation.errors.join(', ')}`);
      }

      // Perform repository search
      const result = await this.propertyRepo.search(search.toSearchParams());
      
      // Process properties with business logic
      const enrichedProperties = result.properties.map(propData => {
        const property = new Property(propData);
        return this.enrichPropertyData(property);
      });

      // Create collection
      const collection = new PropertyCollection(enrichedProperties, result.pagination);

      // Generate search analytics
      const analytics = this.generateSearchAnalytics(collection, search);

      return {
        properties: collection.properties.map(prop => prop.toJSON()),
        pagination: collection.pagination,
        summary: collection.getSummary(),
        analytics,
        searchCriteria: search.toSearchParams(),
        suggestions: this.generateSearchSuggestions(collection, search)
      };

    } catch (error) {
      console.error('Error in PropertyService.searchProperties:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Search properties by address query (zipcode, city, area, or address)
   * @param {string} query - Search term (e.g., "Tokyo", "100-0001")
   * @param {Object} filters - Optional filters (e.g., minPrice, maxPrice)
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} Array of properties
   */
  async searchPropertiesByAddress(query, filters = {}, limit = 50) {
    try {
      if (!query || query.trim().length < 2) {
        return { properties: [], count: 0 };
      }

      // First, find matching locations
      const locations = await this.searchLocations(query, 1); // Limit to 1 for best match
      if (!locations || locations.length === 0) {
        return { properties: [], count: 0 };
      }

      // Get properties for the top matching location
      const topLocation = locations[0];
      const properties = await this.getPropertiesByLocation(topLocation, filters);

      return {
        properties: properties.map(prop => new Property(prop).toJSON()),
        count: properties.length,
        location: {
          type: topLocation.type,
          value: topLocation.value,
          display_text: topLocation.display_text
        }
      };
    } catch (error) {
      console.error('Error searching properties by address:', error);
      throw new Error(`Failed to search properties by address: ${error.message}`);
    }
  }


  /**
   * Get a single property by ID with enhanced data
   * @param {string} id - Property ID
   * @returns {Promise<Object|null>} Enhanced property data or null
   */
  async getPropertyById(id) {
    try {
      if (!id) {
        throw new Error('Property ID is required');
      }

      // Get property from repository
      const propertyData = await this.propertyRepo.findById(id);
      
      if (!propertyData) {
        return null;
      }

      // Create property instance
      const property = new Property(propertyData);
      
      // Enrich with additional data
      const enrichedProperty = this.enrichPropertyData(property);

      // Add related properties (similar properties)
      const relatedProperties = await this.findSimilarProperties(property, 5);

      // Add market comparison data
      const marketComparison = await this.getMarketComparison(property);

      return {
        property: enrichedProperty.toJSON(),
        relatedProperties: relatedProperties.map(prop => prop.getSummary()),
        marketComparison,
        priceHistory: await this.getPriceHistory(id),
        viewingSchedule: this.generateViewingSchedule()
      };

    } catch (error) {
      console.error(`Error in PropertyService.getPropertyById for ID ${id}:`, error);
      throw new Error(`Failed to get property: ${error.message}`);
    }
  }

  /**
   * Create a new property with validation and business rules
   * @param {Object} propertyData - Property data
   * @param {Array} uploadedImages - Uploaded image files
   * @returns {Promise<Object>} Created property with metadata
   */
  async createProperty(propertyData, uploadedImages = []) {
    try {
      // Create property using factory
      const property = PropertyFactory.fromFormData(propertyData, uploadedImages);
      
      // Comprehensive validation
      const validation = this.validatePropertyForCreation(property);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Apply business rules
      this.applyCreationBusinessRules(property);

      // Calculate derived fields
      this.calculateDerivedFields(property);

      // Create in repository
      const createdProperty = await this.propertyRepo.create(property.toJSON());
      
      // Create property instance from created data
      const result = new Property(createdProperty);
      const enrichedResult = this.enrichPropertyData(result);

      // Log creation event (for analytics/audit)
      this.logPropertyEvent('created', result.id, {
        price: result.price,
        area: result.area,
        propertyType: result.propertyType
      });

      return {
        property: enrichedResult.toJSON(),
        validation: {
          isValid: true,
          warnings: validation.warnings || []
        },
        marketInsights: await this.getMarketInsights(result)
      };

    } catch (error) {
      console.error('Error in PropertyService.createProperty:', error);
      throw new Error(`Failed to create property: ${error.message}`);
    }
  }

  /**
   * Update a property with validation and business rules
   * @param {string} id - Property ID
   * @param {Object} updateData - Update data
   * @param {Array} uploadedImages - New uploaded images
   * @returns {Promise<Object>} Updated property
   */
  async updateProperty(id, updateData, uploadedImages = []) {
    try {
      if (!id) {
        throw new Error('Property ID is required');
      }

      // Check if property exists
      const existingProperty = await this.propertyRepo.findById(id);
      if (!existingProperty) {
        throw new Error('Property not found');
      }

      // Handle image updates
      const processedUpdateData = await this.processUpdateData(
        updateData, 
        uploadedImages, 
        existingProperty
      );

      // Create updated property instance for validation
      const updatedProperty = new Property({
        ...existingProperty,
        ...processedUpdateData,
        id,
        updatedAt: new Date()
      });

      // Validate updated property
      const validation = this.validatePropertyForUpdate(updatedProperty, existingProperty);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Apply business rules for updates
      this.applyUpdateBusinessRules(updatedProperty, existingProperty);

      // Recalculate derived fields
      this.calculateDerivedFields(updatedProperty);

      // Update in repository
      const result = await this.propertyRepo.update(id, processedUpdateData);
      
      // Create enriched property instance
      const finalProperty = new Property(result);
      const enrichedProperty = this.enrichPropertyData(finalProperty);

      // Log update event
      this.logPropertyEvent('updated', id, {
        changes: this.getChanges(existingProperty, result)
      });

      return {
        property: enrichedProperty.toJSON(),
        validation: {
          isValid: true,
          warnings: validation.warnings || []
        },
        changes: this.getChanges(existingProperty, result)
      };

    } catch (error) {
      console.error(`Error in PropertyService.updateProperty for ID ${id}:`, error);
      
      if (error.message === 'Property not found') {
        throw error;
      }
      
      throw new Error(`Failed to update property: ${error.message}`);
    }
  }

  /**
   * Delete a property with business rule validation
   * @param {string} id - Property ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteProperty(id) {
    try {
      if (!id) {
        throw new Error('Property ID is required');
      }

      // Get property before deletion for validation and logging
      const property = await this.propertyRepo.findById(id);
      if (!property) {
        throw new Error('Property not found');
      }

      // Business rule validation for deletion
      const canDelete = this.validatePropertyDeletion(property);
      if (!canDelete.allowed) {
        throw new Error(`Cannot delete property: ${canDelete.reason}`);
      }

      // Perform deletion
      const deletedProperty = await this.propertyRepo.delete(id);

      // Log deletion event
      this.logPropertyEvent('deleted', id, {
        title: property.title,
        price: property.price
      });

      return {
        success: true,
        deletedProperty,
        message: 'Property deleted successfully'
      };

    } catch (error) {
      console.error(`Error in PropertyService.deleteProperty for ID ${id}:`, error);
      
      if (error.message === 'Property not found') {
        throw error;
      }
      
      throw new Error(`Failed to delete property: ${error.message}`);
    }
  }

  /**
   * Get property statistics and market analytics
   * @param {Object} filterParams - Optional filters for statistics
   * @returns {Promise<Object>} Comprehensive statistics
   */
  async getPropertyStatistics(filterParams = {}) {
    try {
      // Get basic statistics from repository
      const basicStats = await this.propertyRepo.getStatistics();
      
      // Create statistics instance
      const statistics = new PropertyStatistics(basicStats);

      // Get additional analytics
      const [
        propertyTypeDistribution,
        priceRangeDistribution,
        layoutDistribution,
        yearBuiltDistribution
      ] = await Promise.all([
        this.getPropertyTypeDistribution(),
        this.getPriceRangeDistribution(),
        this.getLayoutDistribution(),
        this.getYearBuiltDistribution()
      ]);

      // Calculate market trends
      const marketTrends = this.calculateMarketTrends();

      return {
        basicStatistics: statistics.toJSON(),
        distributions: {
          propertyTypes: propertyTypeDistribution,
          priceRanges: priceRangeDistribution,
          layouts: layoutDistribution,
          yearBuilt: yearBuiltDistribution
        },
        marketTrends,
        insights: this.generateMarketInsights(statistics),
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in PropertyService.getPropertyStatistics:', error);
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }

  /**
   * Get available options for dropdowns and filters
   * @returns {Promise<Object>} Available options
   */
  async getAvailableOptions() {
    try {
      const [layouts, propertyTypes] = await Promise.all([
        this.propertyRepo.getDistinctLayouts(),
        this.propertyRepo.getDistinctPropertyTypes()
      ]);

      return {
        layouts,
        propertyTypes,
        enums: {
          allPropertyTypes: PropertyEnums.PROPERTY_TYPES,
          allLayouts: PropertyEnums.LAYOUTS,
          transactionModes: PropertyEnums.TRANSACTION_MODES,
          managementForms: PropertyEnums.MANAGEMENT_FORMS,
          landRights: PropertyEnums.LAND_RIGHTS,
          priceRanges: PropertyEnums.PRICE_RANGES,
          sortOptions: PropertyEnums.SORT_OPTIONS
        }
      };

    } catch (error) {
      console.error('Error in PropertyService.getAvailableOptions:', error);
      throw new Error(`Failed to get options: ${error.message}`);
    }
  }

  /**
   * Filter properties using legacy filter format
   * @param {Object} filterParams - Filter parameters
   * @returns {Promise<Object>} Filtered properties
   */
  async filterProperties(filterParams) {
    try {
      // Validate filter parameters
      const validation = this.validateFilterParams(filterParams);
      if (!validation.isValid) {
        throw new Error(`Invalid filter parameters: ${validation.errors.join(', ')}`);
      }

      // Use repository filter method
      const properties = await this.propertyRepo.filter(filterParams);
      
      // Process properties with business logic
      const enrichedProperties = properties.map(propData => {
        const property = new Property(propData);
        return this.enrichPropertyData(property);
      });

      // Create collection
      const collection = new PropertyCollection(enrichedProperties);

      return {
        properties: collection.properties.map(prop => prop.toJSON()),
        summary: collection.getSummary(),
        filterApplied: filterParams
      };

    } catch (error) {
      console.error('Error in PropertyService.filterProperties:', error);
      throw new Error(`Filter failed: ${error.message}`);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Enrich property data with calculated fields and business logic
   * @private
   * @param {Property} property - Property instance
   * @returns {Property} Enhanced property
   */
  enrichPropertyData(property) {
    // Calculate price per square meter if not set
    if (!property.pricePerSquareMeter && property.price && property.area) {
      property.pricePerSquareMeter = property.calculatePricePerSquareMeter();
    }

    // Add market category
    property._marketCategory = this.categorizeProperty(property);
    
    // Add value assessment
    property._valueAssessment = this.assessPropertyValue(property);
    
    // Add features summary
    property._featuresScore = this.calculateFeaturesScore(property);

    return property;
  }

  /**
   * Comprehensive validation for property creation
   * @private
   * @param {Property} property - Property to validate
   * @returns {Object} Validation result
   */
  validatePropertyForCreation(property) {
    const validation = property.validate();
    const customValidation = this.performCustomValidation(property);
    
    return {
      isValid: validation.isValid && customValidation.isValid,
      errors: [...validation.errors, ...customValidation.errors],
      warnings: [...(validation.warnings || []), ...(customValidation.warnings || [])]
    };
  }

  /**
   * Validation for property updates
   * @private
   * @param {Property} updatedProperty - Updated property
   * @param {Object} existingProperty - Existing property data
   * @returns {Object} Validation result
   */
  validatePropertyForUpdate(updatedProperty, existingProperty) {
    const validation = this.validatePropertyForCreation(updatedProperty);
    
    // Additional update-specific validations
    const updateValidation = this.validateUpdateBusinessRules(updatedProperty, existingProperty);
    
    return {
      isValid: validation.isValid && updateValidation.isValid,
      errors: [...validation.errors, ...updateValidation.errors],
      warnings: [...(validation.warnings || []), ...(updateValidation.warnings || [])]
    };
  }

  /**
   * Custom business validation rules
   * @private
   * @param {Property} property - Property to validate
   * @returns {Object} Validation result
   */
  performCustomValidation(property) {
    const errors = [];
    const warnings = [];

    // Price validation based on area
    if (property.price && property.area) {
      const pricePerSqm = property.price / property.area;
      if (pricePerSqm < 1000) {
        warnings.push('Price per square meter seems unusually low');
      }
      if (pricePerSqm > 100000) {
        warnings.push('Price per square meter seems unusually high');
      }
    }

    // Year built validation
    if (property.yearBuilt) {
      const year = parseInt(property.yearBuilt);
      const currentYear = new Date().getFullYear();
      if (year > currentYear + 2) {
        errors.push('Year built cannot be more than 2 years in the future');
      }
    }

    // Management fee validation
    if (property.price && property.managementFee) {
      const monthlyFeeRatio = (property.managementFee * 12) / property.price;
      if (monthlyFeeRatio > 0.1) {
        warnings.push('Management fees seem high relative to property price');
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Apply business rules when creating property
   * @private
   * @param {Property} property - Property to modify
   */
  applyCreationBusinessRules(property) {
    // Set default transaction mode if not specified
    if (!property.transactionMode) {
      property.transactionMode = 'sale';
    }

    // Set information release date if not specified
    if (!property.informationReleaseDate) {
      property.informationReleaseDate = new Date();
    }

    // Generate property number if not provided
    if (!property.propertyNumber) {
      property.propertyNumber = this.generatePropertyNumber(property);
    }
  }

  /**
   * Apply business rules when updating property
   * @private
   * @param {Property} updatedProperty - Updated property
   * @param {Object} existingProperty - Existing property data
   */
  applyUpdateBusinessRules(updatedProperty, existingProperty) {
    // Preserve creation timestamp
    updatedProperty.createdAt = existingProperty.createdAt;
    
    // Update modification timestamp
    updatedProperty.updatedAt = new Date();

    // Business rule: cannot change property number once set
    if (existingProperty.propertyNumber && 
        updatedProperty.propertyNumber !== existingProperty.propertyNumber) {
      updatedProperty.propertyNumber = existingProperty.propertyNumber;
    }
  }

  /**
   * Calculate derived fields
   * @private
   * @param {Property} property - Property to calculate fields for
   */
  calculateDerivedFields(property) {
    // Calculate price per square meter
    if (property.price && property.area && !property.pricePerSquareMeter) {
      property.pricePerSquareMeter = property.calculatePricePerSquareMeter();
    }

    // Calculate total monthly costs
    property._totalMonthlyCosts = property.getTotalMonthlyCosts();

    // Calculate property age
    property._propertyAge = property.getPropertyAge();
  }

  /**
   * Find similar properties
   * @private
   * @param {Property} property - Reference property
   * @param {number} limit - Maximum number of similar properties
   * @returns {Promise<Array<Property>>} Similar properties
   */
  async findSimilarProperties(property, limit = 5) {
    try {
      const searchParams = {
        propertyType: property.propertyType,
        minPrice: Math.floor(property.price * 0.8),
        maxPrice: Math.ceil(property.price * 1.2),
        minArea: Math.floor(property.area * 0.8),
        maxArea: Math.ceil(property.area * 1.2),
        layout: property.layout,
        limit
      };

      const result = await this.propertyRepo.search(searchParams);
      return result.properties
        .filter(prop => prop.id !== property.id)
        .map(propData => new Property(propData));

    } catch (error) {
      console.error('Error finding similar properties:', error);
      return [];
    }
  }

  /**
   * Get market comparison data
   * @private
   * @param {Property} property - Property to compare
   * @returns {Promise<Object|null>} Market comparison data
   */
  async getMarketComparison(property) {
    try {
      const stats = await this.propertyRepo.getStatistics();
      
      return {
        averagePrice: stats.averagePrice,
        priceComparison: property.price > stats.averagePrice ? 'above' : 'below',
        averageArea: stats.averageArea,
        areaComparison: property.area > stats.averageArea ? 'larger' : 'smaller',
        marketPosition: this.calculateMarketPosition(property, stats)
      };

    } catch (error) {
      console.error('Error getting market comparison:', error);
      return null;
    }
  }

  /**
   * Generate property-specific insights
   * @private
   * @param {Property} property - Property to analyze
   * @returns {Promise<Array>} Market insights
   */
  async getMarketInsights(property) {
    const insights = [];

    // Price insights
    if (property.calculatePricePerSquareMeter() < 5000) {
      insights.push({
        type: 'price',
        message: 'This property is priced competitively for its size',
        level: 'positive'
      });
    }

    // Location insights
    if (property.transportation && property.transportation.includes('JR')) {
      insights.push({
        type: 'location',
        message: 'Good transportation access with JR line',
        level: 'positive'
      });
    }

    return insights;
  }

  // ============================================================================
  // UTILITY METHODS - All return simple values to avoid compile errors
  // ============================================================================

  categorizeProperty(property) {
    if (property.price < 500000) return 'budget';
    if (property.price < 1500000) return 'mid-range';
    return 'luxury';
  }

  assessPropertyValue(property) {
    const pricePerSqm = property.calculatePricePerSquareMeter();
    
    if (pricePerSqm < 3000) return 'excellent_value';
    if (pricePerSqm < 6000) return 'good_value';
    if (pricePerSqm < 10000) return 'fair_value';
    return 'premium_pricing';
  }

  calculateFeaturesScore(property) {
    let score = 0;
    
    if (property.pets) score += 10;
    if (property.parking && property.parking !== 'none') score += 15;
    if (property.balconyArea > 0) score += 5;
    if (property.kitchen && property.kitchen.includes('modern')) score += 10;
    if (property.bathToilet && property.bathToilet.includes('separate')) score += 5;
    
    return Math.min(score, 100);
  }

  generateSearchAnalytics(collection, search) {
    return {
      totalResults: collection.pagination.total,
      averagePrice: collection.getSummary().averagePrice,
      priceRange: collection.getSummary().priceRange,
      commonFeatures: this.extractCommonFeatures(collection.properties),
      searchEffectiveness: collection.properties.length > 0 ? 'good' : 'poor'
    };
  }

  generateSearchSuggestions(collection, search) {
    const suggestions = [];

    if (collection.isEmpty()) {
      suggestions.push('Try expanding your price range');
      suggestions.push('Consider different property types');
      suggestions.push('Remove some specific filters');
    } else if (collection.properties.length < 5) {
      suggestions.push('Consider expanding your area requirements');
      suggestions.push('Try including nearby locations');
    }

    return suggestions;
  }

  validatePropertyDeletion(property) {
    return {
      allowed: true,
      reason: null
    };
  }

  generatePropertyNumber(property) {
    const prefix = property.propertyType.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    
    return `${prefix}-${timestamp}-${random}`;
  }

  logPropertyEvent(event, propertyId, metadata = {}) {
    console.log(`Property Event: ${event} - ID: ${propertyId}`, metadata);
  }

  // Simple placeholder methods that return basic values
  async getPropertyTypeDistribution() {
    return {
      apartment: 45,
      house: 25,
      condo: 20,
      other: 10
    };
  }

  async getPriceRangeDistribution() { 
    return {
      'under_500k': 30,
      '500k_1m': 40,
      '1m_2m': 20,
      'over_2m': 10
    };
  }

  async getLayoutDistribution() { 
    return {
      '1R': 15,
      '1K': 20,
      '1LDK': 25,
      '2LDK': 30,
      'other': 10
    };
  }

  async getYearBuiltDistribution() { 
    return {
      'before_1990': 20,
      '1990_2000': 25,
      '2000_2010': 30,
      'after_2010': 25
    };
  }

  calculateMarketTrends() { 
    return {
      priceChange: 2.5,
      volumeChange: -5.2,
      period: 'month'
    };
  }

  generateMarketInsights(statistics) { 
    return [
      {
        type: 'market',
        message: 'Market showing steady growth',
        level: 'positive'
      }
    ];
  }

  async getPriceHistory(id) { 
    return [];
  }

  generateViewingSchedule() { 
    return [
      { date: '2025-01-25', time: '10:00' },
      { date: '2025-01-25', time: '14:00' }
    ];
  }

  calculateMarketPosition(property, stats) { 
    if (property.price > stats.averagePrice * 1.2) return 'premium';
    if (property.price < stats.averagePrice * 0.8) return 'budget';
    return 'average';
  }

  getChanges(oldData, newData) { 
    return {
      fields: ['price', 'area'],
      timestamp: new Date().toISOString()
    };
  }

  async processUpdateData(updateData, images, existing) { 
    const processed = { ...updateData };
    
    if (images && images.length > 0) {
      const newImages = images.map(file => `/images/${file.filename}`);
      processed.images = updateData.replaceImages === 'true' 
        ? newImages 
        : [...(existing.images || []), ...newImages];
    }
    
    return processed;
  }

  validateUpdateBusinessRules(updated, existing) { 
    return { 
      isValid: true, 
      errors: [], 
      warnings: [] 
    };
  }

  validateFilterParams(params) { 
    const errors = [];
    
    if (params.minPrice && params.maxPrice && params.minPrice > params.maxPrice) {
      errors.push('minPrice cannot be greater than maxPrice');
    }
    
    return { 
      isValid: errors.length === 0, 
      errors 
    };
  }

  extractCommonFeatures(properties) { 
    return ['parking', 'pets_allowed', 'modern_kitchen'];
  }

  /**

   * Search for locations based on user input (city, postcode, or address)

   * Returns suggestions for dropdown

   */

  async searchLocations(query, limit = 10) {
    console.log('searchLocations called with:', { query, limit });
    if (!query || query.trim().length < 2) {
      return [];
    }
    if (!this.db) {
      console.error('Database pool not initialized');
      throw new Error('Database connection not available');
    }

    const searchTerm = `%${query.trim()}%`;
    try {

      const suggestions = await this.db.query(`

        WITH location_suggestions AS (

          -- Search by zipcode

          SELECT DISTINCT

            'zipcode' as type,

            zipcode as value,

            CONCAT(zipcode, ' - ', area_level_4, ', ', area_level_2) as display_text,

            area_level_1,

            area_level_2,

            area_level_3,

            area_level_4,

            zipcode,

            COUNT(*) as property_count

          FROM properties

          WHERE zipcode ILIKE $1

            AND status = 'for sale'

          GROUP BY zipcode, area_level_1, area_level_2, area_level_3, area_level_4

         

          UNION ALL

         

          -- Search by area_level_4 (ward/city)

          SELECT DISTINCT

            'city' as type,

            area_level_4 as value,

            CONCAT(area_level_4, ', ', area_level_2, ' (', area_level_3, ')') as display_text,

            area_level_1,

            area_level_2,

            area_level_3,

            area_level_4,

            NULL as zipcode,

            COUNT(*) as property_count

          FROM properties

          WHERE area_level_4 ILIKE $1

            AND status = 'for sale'

          GROUP BY area_level_1, area_level_2, area_level_3, area_level_4

         

          UNION ALL

         

          -- Search by area_level_3 (special ward area)

          SELECT DISTINCT

            'area' as type,

            area_level_3 as value,

            CONCAT(area_level_3, ', ', area_level_2) as display_text,

            area_level_1,

            area_level_2,

            area_level_3,

            NULL as area_level_4,

            NULL as zipcode,

            COUNT(*) as property_count

          FROM properties

          WHERE area_level_3 ILIKE $1

            AND status = 'for sale'

          GROUP BY area_level_1, area_level_2, area_level_3

         

          UNION ALL

         

          -- Search by address

          SELECT DISTINCT

            'address' as type,

            address as value,

            address as display_text,

            area_level_1,

            area_level_2,

            area_level_3,

            area_level_4,

            zipcode,

            1 as property_count

          FROM properties

          WHERE address ILIKE $1

            AND status = 'for sale'

        )

        SELECT *

        FROM location_suggestions

        ORDER BY

          CASE type

            WHEN 'zipcode' THEN 1

            WHEN 'city' THEN 2

            WHEN 'area' THEN 3

            WHEN 'address' THEN 4

          END,

          property_count DESC,

          display_text ASC

        LIMIT $2

      `, [searchTerm, limit]);

 

      return suggestions.rows || [];

    } catch (error) {

      console.error('Error searching locations:', error);

      throw new Error(`Failed to search locations: ${error.message}`);

    }

  }

 

  /**

   * Get properties based on selected location suggestion

   */

  async getPropertiesByLocation(locationData, filters = {}) {
    console.log('getPropertiesByLocation called with:', { locationData, filters });
    const { type, value, area_level_1, area_level_2, area_level_3, area_level_4, zipcode } = locationData;

   

    let whereConditions = ['status = $1'];

    let queryParams = ['for sale'];

    let paramIndex = 2;

 

    // Build WHERE clause based on location type

    switch (type) {

      case 'zipcode':

        whereConditions.push(`zipcode = $${paramIndex}`);

        queryParams.push(zipcode);

        paramIndex++;

        break;

     

      case 'city':

        whereConditions.push(`area_level_4 = $${paramIndex}`);

        queryParams.push(area_level_4);

        paramIndex++;

        break;

     

      case 'area':

        whereConditions.push(`area_level_3 = $${paramIndex}`);

        queryParams.push(area_level_3);

        paramIndex++;

        break;

     

      case 'address':

        whereConditions.push(`address ILIKE $${paramIndex}`);

        queryParams.push(`%${value}%`);

        paramIndex++;

        break;

    }

 

    // Add additional filters

    if (filters.minPrice) {

      whereConditions.push(`price >= $${paramIndex}`);

      queryParams.push(filters.minPrice);

      paramIndex++;

    }

 

    if (filters.maxPrice) {

      whereConditions.push(`price <= $${paramIndex}`);

      queryParams.push(filters.maxPrice);

      paramIndex++;

    }

 

    if (filters.propertyType) {

      whereConditions.push(`propertyType = $${paramIndex}`);

      queryParams.push(filters.propertyType);

      paramIndex++;

    }

 

    if (filters.minArea) {

      whereConditions.push(`area >= $${paramIndex}`);

      queryParams.push(filters.minArea);

      paramIndex++;

    }

 

    if (filters.maxArea) {

      whereConditions.push(`area <= $${paramIndex}`);

      queryParams.push(filters.maxArea);

      paramIndex++;

    }

 

    try {

      const result = await this.db.query(`

      SELECT
          id,
          title,
          price::numeric as price,
          pricepersquaremeter::numeric as "pricePerSquareMeter",
          address,
          layout,
          area::numeric as area,
          floorinfo as "floorInfo",
          structure,
          managementfee::numeric as "managementFee",
          areaofuse as "areaOfUse",
          transportation,
          ST_AsGeoJSON(location)::jsonb AS location,
          propertytype as "propertyType",
          yearbuilt as "yearBuilt",
          balconyarea::numeric as "balconyArea",
          totalunits as "totalUnits",
          repairreservefund::numeric as "repairReserveFund",
          landleasefee::numeric as "landLeaseFee",
          rightfee as "rightFee",
          depositguarantee::numeric as "depositGuarantee",
          maintenancefees as "maintenanceFees",
          otherfees::numeric as "otherFees",
          bicycleparking as "bicycleParking",
          bikestorage as "bikeStorage",
          sitearea as "siteArea",
          pets,
          landrights as "landRights",
          managementform as "managementForm",
          landlawnotification as "landLawNotification",
          currentsituation as "currentSituation",
          extraditionpossibledate as "extraditionPossibleDate",
          transactionmode as "transactionMode",
          propertynumber as "propertyNumber",
          informationreleasedate as "informationReleaseDate",
          nextscheduledupdatedate as "nextScheduledUpdateDate",
          remarks,
          evaluationcertificate as "evaluationCertificate",
          parking,
          kitchen,
          bathtoilet as "bathToilet",
          facilitiesservices as "facilitiesServices",
          others,
          images,
          createdat as "createdAt",
          updatedat as "updatedAt"
        FROM properties

        WHERE ${whereConditions.join(' AND ')}

        ORDER BY createdAt DESC

        LIMIT 50

      `, queryParams);

      // Enrich properties with business logic
      const enrichedProperties = result.rows.map(propData => {
        const property = new Property(propData);
        return this.enrichPropertyData(property).toJSON();
      });

      return enrichedProperties;

    } catch (error) {

      console.error('Error getting properties by location:', error);

      throw new Error('Failed to get properties');

    }

  }

 

  /**

   * Get popular locations for initial suggestions

   */

  async getPopularLocations(limit = 20) {
    console.log('getPopularLocations called with:', { limit });
    try {

      const result = await this.db.query(`

        WITH popular_areas AS (

          SELECT

            'city' as type,

            area_level_4 as value,

            CONCAT(area_level_4, ', ', area_level_2) as display_text,

            area_level_1,

            area_level_2,

            area_level_3,

            area_level_4,

            NULL as zipcode,

            COUNT(*) as property_count

          FROM properties

          WHERE status = 'for sale'

            AND area_level_4 IS NOT NULL

          GROUP BY area_level_1, area_level_2, area_level_3, area_level_4

          HAVING COUNT(*) >= 5

          ORDER BY property_count DESC

          LIMIT $1

        )

        SELECT * FROM popular_areas

      `, [limit]);

 

      return result.rows;

    } catch (error) {

      console.error('Error getting popular locations:', error);

      throw new Error('Failed to get popular locations');

    }

  }
    
}

export default PropertyService;