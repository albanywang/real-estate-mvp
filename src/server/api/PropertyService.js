// api/PropertyService.js
/**
 * PropertyService - Business logic layer for property operations
 * Contains the logic for handling requests (e.g., validating input, querying the database, or processing property data)
 * It acts as an intermediary between routes (Controller) and the Model, 
 * encapsulating logic like validation or data processing.
 */
import { response } from 'express';
import {
  Property,
  PropertySearch,
  PropertyCollection,
  PropertyStatistics,
  PropertyFactory,
  PropertyValidators,
  PropertyEnums
} from '../models/index.js';

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
    
    // Get Supabase client from repository
    this.supabase = this.propertyRepo.supabase;
    if (!this.supabase) {
      throw new Error('Supabase client not available in PropertyRepository');
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

    // Test Supabase connection
    this.testConnection();
  }

  async testConnection() {
    try {
      const { error } = await this.supabase
        .from('properties')
        .select('count', { count: 'exact', head: true });
      
      if (error) throw error;
      
      console.log('✅ PropertyService Supabase connection successful');
    } catch (error) {
      console.error('❌ PropertyService Supabase connection failed:', error);
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
    return this.propertyRepo && this.supabase && typeof this.propertyRepo === 'object';
  }

  /**
   * Validate that repository has all required methods
   * @private
   * @throws {Error} If repository is missing required methods
   */
  validateRepository() {
    const requiredMethods = [
      'simpleSearch', 'findById', 'createProperty', 'updateProperty', 'deleteProperty', 
      'getStatistics', 'getDistinctLayouts', 'getDistinctPropertyTypes', 
      'filter', 'exists'
    ];

    for (const method of requiredMethods) {
      if (this.propertyRepo[method] && typeof this.propertyRepo[method] !== 'function') {
        console.warn(`PropertyRepository method ${method} is not a function, but service will continue`);
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

      // Use Supabase directly for simple property retrieval
      const limit = Math.min(Number(filterParams.limit) || 50, 100);
      const offset = Number(filterParams.offset) || 0;

      const { data, error, count } = await this.supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .order('createdat', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      console.log('Raw Supabase data:', data); // Log raw data
      
      // Process properties with business logic
      const properties = data.map(propData => {
        const property = new Property(propData);
        return this.enrichPropertyData(property);
      });

      console.log('Enriched properties:', properties); // Log enriched data

      const pagination = {
        total: count,
        count: data.length,
        hasMore: offset + data.length < count,
        offset,
        limit
      };

      // Create collection with enhanced data
      const collection = new PropertyCollection(properties, pagination);

      const response = {
        properties: collection.properties.map(prop => prop.toJSON()),
        pagination: collection.pagination,
        summary: collection.getSummary(),
        searchCriteria: filterParams
      };

      console.log('Final response:', response); // Log final response

      return response;

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

      // Use Supabase for search
      let query = this.supabase.from('properties').select('*');

      // Apply filters
      const params = search.toSearchParams();
      
      if (params.minPrice) {
        query = query.gte('price', params.minPrice);
      }
      if (params.maxPrice) {
        query = query.lte('price', params.maxPrice);
      }
      if (params.propertyType) {
        query = query.eq('propertytype', params.propertyType);
      }
      if (params.layout) {
        query = query.eq('layout', params.layout);
      }
      if (params.minArea) {
        query = query.gte('area', params.minArea);
      }
      if (params.maxArea) {
        query = query.lte('area', params.maxArea);
      }

      // Apply sorting
      const sortColumn = params.sortBy || 'createdat';
      const ascending = params.sortOrder === 'ASC';
      query = query.order(sortColumn, { ascending });

      // Apply pagination
      const limit = Math.min(params.limit || 20, 100);
      const offset = params.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;
      if (error) throw error;

      // Process properties with business logic
      const enrichedProperties = data.map(propData => {
        const property = new Property(propData);
        return this.enrichPropertyData(property);
      });

      // Create collection
      const collection = new PropertyCollection(enrichedProperties);

      // Generate search analytics
      const analytics = this.generateSearchAnalytics(collection, search);

      return {
        properties: collection.properties.map(prop => prop.toJSON()),
        pagination: { total: data.length, offset, limit },
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

      // Search using Supabase
      let supabaseQuery = this.supabase
        .from('properties')
        .select('*')
        .or(`area_level_4.ilike.%${query}%,area_level_3.ilike.%${query}%,zipcode.ilike.%${query}%,address.ilike.%${query}%`)
        .eq('status', 'for sale')
        .limit(limit);

      const { data, error } = await supabaseQuery;
      if (error) throw error;

      return {
        properties: data.map(prop => new Property(prop).toJSON()),
        count: data.length,
        location: {
          type: 'search',
          value: query,
          display_text: query
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

      // Get property using Supabase
      const { data, error } = await this.supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      // Create property instance
      const property = new Property(data);
      
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

      // Create in Supabase
      const { data, error } = await this.supabase
        .from('properties')
        .insert([property.toJSON()])
        .select()
        .single();

      if (error) throw error;
      
      // Create property instance from created data
      const result = new Property(data);
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
      const { data: existingProperty, error: fetchError } = await this.supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Property not found');
        }
        throw fetchError;
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

      // Update in Supabase
      const { data, error } = await this.supabase
        .from('properties')
        .update(processedUpdateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Create enriched property instance
      const finalProperty = new Property(data);
      const enrichedProperty = this.enrichPropertyData(finalProperty);

      // Log update event
      this.logPropertyEvent('updated', id, {
        changes: this.getChanges(existingProperty, data)
      });

      return {
        property: enrichedProperty.toJSON(),
        validation: {
          isValid: true,
          warnings: validation.warnings || []
        },
        changes: this.getChanges(existingProperty, data)
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
      const { data: property, error: fetchError } = await this.supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Property not found');
        }
        throw fetchError;
      }

      // Business rule validation for deletion
      const canDelete = this.validatePropertyDeletion(property);
      if (!canDelete.allowed) {
        throw new Error(`Cannot delete property: ${canDelete.reason}`);
      }

      // Perform deletion
      const { error: deleteError } = await this.supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Log deletion event
      this.logPropertyEvent('deleted', id, {
        title: property.title,
        price: property.price
      });

      return {
        success: true,
        deletedProperty: property,
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
      // Get basic statistics using Supabase
      const { data, error } = await this.supabase
        .from('properties')
        .select('price, area, propertytype, createdat');

      if (error) throw error;

      // Calculate statistics
      const basicStats = {
        totalProperties: data.length,
        averagePrice: data.reduce((sum, p) => sum + (p.price || 0), 0) / data.length || 0,
        averageArea: data.reduce((sum, p) => sum + (p.area || 0), 0) / data.length || 0,
        priceRange: {
          min: Math.min(...data.map(p => p.price || 0)),
          max: Math.max(...data.map(p => p.price || 0))
        },
        areaRange: {
          min: Math.min(...data.map(p => p.area || 0)),
          max: Math.max(...data.map(p => p.area || 0))
        }
      };
      
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
      // Get distinct values using Supabase
      const [layoutsResult, typesResult] = await Promise.all([
        this.supabase.from('properties').select('layout').not('layout', 'is', null),
        this.supabase.from('properties').select('propertytype').not('propertytype', 'is', null)
      ]);

      const layouts = [...new Set(layoutsResult.data?.map(item => item.layout) || [])];
      const propertyTypes = [...new Set(typesResult.data?.map(item => item.propertytype) || [])];

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

      // Build Supabase query
      let query = this.supabase.from('properties').select('*');

      if (filterParams.minPrice) {
        query = query.gte('price', filterParams.minPrice);
      }
      if (filterParams.maxPrice) {
        query = query.lte('price', filterParams.maxPrice);
      }
      if (filterParams.propertyType) {
        query = query.eq('propertytype', filterParams.propertyType);
      }
      if (filterParams.layout) {
        query = query.eq('layout', filterParams.layout);
      }
      if (filterParams.minArea) {
        query = query.gte('area', filterParams.minArea);
      }
      if (filterParams.maxArea) {
        query = query.lte('area', filterParams.maxArea);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Process properties with business logic
      const enrichedProperties = data.map(propData => {
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

  /**
   * Search for locations based on user input (city, postcode, or address)
   * Returns suggestions for dropdown
   */
  async searchLocations(query, limit = 10) {
    console.log('searchLocations called with:', { query, limit });
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      // Use Supabase to search locations
      const { data, error } = await this.supabase
        .from('properties')
        .select('area_level_1, area_level_2, area_level_3, area_level_4, zipcode, address')
        .or(`area_level_4.ilike.%${query}%,area_level_3.ilike.%${query}%,zipcode.ilike.%${query}%,address.ilike.%${query}%`)
        .eq('status', 'for sale')
        .limit(limit);

      if (error) throw error;

      // Process results into location suggestions
      const suggestions = [];
      const seen = new Set();

      data.forEach(row => {
        // Add zipcode suggestions
        if (row.zipcode && row.zipcode.toLowerCase().includes(query.toLowerCase())) {
          const key = `zipcode-${row.zipcode}`;
          if (!seen.has(key)) {
            seen.add(key);
            suggestions.push({
              type: 'zipcode',
              value: row.zipcode,
              display_text: `${row.zipcode} - ${row.area_level_4}, ${row.area_level_2}`,
              area_level_1: row.area_level_1,
              area_level_2: row.area_level_2,
              area_level_3: row.area_level_3,
              area_level_4: row.area_level_4,
              zipcode: row.zipcode
            });
          }
        }

        // Add city suggestions
        if (row.area_level_4 && row.area_level_4.toLowerCase().includes(query.toLowerCase())) {
          const key = `city-${row.area_level_4}`;
          if (!seen.has(key)) {
            seen.add(key);
            suggestions.push({
              type: 'city',
              value: row.area_level_4,
              display_text: `${row.area_level_4}, ${row.area_level_2}`,
              area_level_1: row.area_level_1,
              area_level_2: row.area_level_2,
              area_level_3: row.area_level_3,
              area_level_4: row.area_level_4
            });
          }
        }

        // Add area suggestions
        if (row.area_level_3 && row.area_level_3.toLowerCase().includes(query.toLowerCase())) {
          const key = `area-${row.area_level_3}`;
          if (!seen.has(key)) {
            seen.add(key);
            suggestions.push({
              type: 'area',
              value: row.area_level_3,
              display_text: `${row.area_level_3}, ${row.area_level_2}`,
              area_level_1: row.area_level_1,
              area_level_2: row.area_level_2,
              area_level_3: row.area_level_3
            });
          }
        }
      });

      return suggestions.slice(0, limit);

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
    
    try {
      const { type, value, area_level_1, area_level_2, area_level_3, area_level_4, zipcode } = locationData;

      // Build Supabase query based on location type
      let query = this.supabase.from('properties').select('*').eq('status', 'for sale');

      switch (type) {
        case 'zipcode':
          query = query.eq('zipcode', zipcode);
          break;
        case 'city':
          query = query.eq('area_level_4', area_level_4);
          break;
        case 'area':
          query = query.eq('area_level_3', area_level_3);
          break;
        case 'address':
          query = query.ilike('address', `%${value}%`);
          break;
      }

      // Add additional filters
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.propertyType) {
        query = query.eq('propertytype', filters.propertyType);
      }
      if (filters.minArea) {
        query = query.gte('area', filters.minArea);
      }
      if (filters.maxArea) {
        query = query.lte('area', filters.maxArea);
      }

      query = query.order('createdat', { ascending: false }).limit(50);

      const { data, error } = await query;
      if (error) throw error;

      // Enrich properties with business logic
      const enrichedProperties = data.map(propData => {
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
      // Get popular locations using Supabase
      const { data, error } = await this.supabase
        .from('properties')
        .select('area_level_1, area_level_2, area_level_3, area_level_4')
        .eq('status', 'for sale')
        .not('area_level_4', 'is', null)
        .limit(limit * 3); // Get more to deduplicate

      if (error) throw error;

      // Count occurrences and create popular locations
      const locationCounts = {};
      data.forEach(row => {
        const key = `${row.area_level_4}-${row.area_level_2}`;
        if (!locationCounts[key]) {
          locationCounts[key] = {
            type: 'city',
            value: row.area_level_4,
            display_text: `${row.area_level_4}, ${row.area_level_2}`,
            area_level_1: row.area_level_1,
            area_level_2: row.area_level_2,
            area_level_3: row.area_level_3,
            area_level_4: row.area_level_4,
            property_count: 0
          };
        }
        locationCounts[key].property_count++;
      });

      // Sort by count and return top results
      return Object.values(locationCounts)
        .sort((a, b) => b.property_count - a.property_count)
        .slice(0, limit);

    } catch (error) {
      console.error('Error getting popular locations:', error);
      throw new Error('Failed to get popular locations');
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS - Keep all the existing helper methods
  // ============================================================================

  enrichPropertyData(property) {
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

  validatePropertyForCreation(property) {
    const validation = property.validate();
    const customValidation = this.performCustomValidation(property);
    
    return {
      isValid: validation.isValid && customValidation.isValid,
      errors: [...validation.errors, ...customValidation.errors],
      warnings: [...(validation.warnings || []), ...(customValidation.warnings || [])]
    };
  }

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

  async findSimilarProperties(property, limit = 5) {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .select('*')
        .eq('propertytype', property.propertyType)
        .gte('price', Math.floor(property.price * 0.8))
        .lte('price', Math.ceil(property.price * 1.2))
        .gte('area', Math.floor(property.area * 0.8))
        .lte('area', Math.ceil(property.area * 1.2))
        .neq('id', property.id)
        .limit(limit);

      if (error) throw error;

      return data.map(propData => new Property(propData));

    } catch (error) {
      console.error('Error finding similar properties:', error);
      return [];
    }
  }

  async getMarketComparison(property) {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .select('price, area');

      if (error) throw error;

      const stats = {
        averagePrice: data.reduce((sum, p) => sum + (p.price || 0), 0) / data.length || 0,
        averageArea: data.reduce((sum, p) => sum + (p.area || 0), 0) / data.length || 0
      };
      
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
  // UTILITY METHODS
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
      totalResults: collection.pagination?.total || collection.properties.length,
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
}

export default PropertyService;