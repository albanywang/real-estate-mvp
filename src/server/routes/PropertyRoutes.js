// routes/PropertyRoutes.js
// Defines Express routes for property-related endpoints
// It acts as the entry point for HTTP requests and delegates logic to services or directly interacts with models
// It is the Controller layer of MVC models
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Property,
  PropertySearch,
  PropertyCollection,
  PropertyFactory,
  PropertyEnums,
  PropertyValidators
} from '../models/index.js';

// Import PropertyService
import PropertyService from '../api/PropertyService.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function for API
function formatDateToString(date) {
  if (!date) return null;
  
  // If it's already a string in YYYY-MM-DD format, return as-is
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Convert Date object to YYYY-MM-DD string in local timezone
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * PropertyRoutes - Handles all property-related HTTP routes
 */
class PropertyRoutes {
  constructor(propertyRepository, propertyService = null, supabaseClient = null) {
    // Validate repository
    if (!propertyRepository) {
      throw new Error('PropertyRepository is required');
    }

    this.propertyRepo = propertyRepository;
    this.supabase = supabaseClient;
    
    // Initialize service - create new one if not provided
    if (propertyService) {
      this.propertyService = propertyService;
    } else {
      console.log('Creating new PropertyService instance...');
      this.propertyService = new PropertyService(propertyRepository);
    }

    // Validate service is properly initialized
    if (!this.propertyService) {
      throw new Error('PropertyService initialization failed');
    }

    console.log('PropertyRoutes initialized with service:', !!this.propertyService);

    this.router = express.Router();
    
    // Configure multer for image uploads
    this.upload = this.configureMulter();
    
    // Setup all routes
    this.setupRoutes();
  }

  /**
   * Configure multer for file uploads
   * @returns {multer} Configured multer instance
   */
  configureMulter() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'property-' + uniqueSuffix + ext);
      }
    });

    const fileFilter = (req, file, cb) => {
      // Check file type
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    };

    return multer({ 
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 20 // Maximum 20 files
      }
    });
  }

  /**
   * Setup all property routes
   */
  setupRoutes() {
    // GET routes
    this.router.get('/', this.getAllProperties.bind(this));
    this.router.get('/search', this.searchProperties.bind(this));
    this.router.get('/statistics', this.getStatistics.bind(this));
    this.router.get('/layouts', this.getLayouts.bind(this));
    this.router.get('/property-types', this.getPropertyTypes.bind(this));
    this.router.get('/enums', this.getEnums.bind(this));
    
    // NEW LOCATION SEARCH ROUTES
    this.router.get('/search/locations', this.searchLocations.bind(this));
    this.router.get('/search/popular-locations', this.getPopularLocations.bind(this));
    this.router.get('/search/suggestions/:type', this.getLocationSuggestions.bind(this));
    this.router.get('/search/address', this.searchPropertiesByAddress.bind(this));

    // Debug routes (temporary)
    this.router.get('/debug/raw', this.debugRaw.bind(this));
    this.router.get('/debug/count', this.debugCount.bind(this));
    
    this.router.get('/:id', this.getPropertyById.bind(this));

    // POST routes
    this.router.post('/', this.upload.array('images', 20), this.createProperty.bind(this));
    this.router.post('/filter', this.filterProperties.bind(this));
    this.router.post('/bulk-import', this.upload.single('csv'), this.bulkImport.bind(this));

    // NEW LOCATION SEARCH POST ROUTE
    this.router.post('/search/by-location', this.searchByLocation.bind(this));

    // PUT routes
    this.router.put('/:id', this.upload.array('images', 20), this.updateProperty.bind(this));

    // DELETE routes
    this.router.delete('/:id', this.deleteProperty.bind(this));

    // Utility routes
    this.router.get('/:id/exists', this.checkPropertyExists.bind(this));
  }

  /**
   * GET /properties/search/locations
   * Search for location suggestions (city, postcode, address)
   */
  async searchLocations(req, res) {
    try {
      const { q: query, limit = 10 } = req.query;
    
      if (!query || query.trim().length < 2) {
        return res.json({
          success: true,
          data: [],
          count: 0
        });
      }

      // Use Supabase to search for location suggestions
      const { data, error } = await this.supabase
        .from('properties')
        .select('area_level_1, area_level_2, area_level_3, area_level_4, zipcode, address')
        .or(`area_level_4.ilike.%${query.trim()}%,area_level_3.ilike.%${query.trim()}%,zipcode.ilike.%${query.trim()}%,address.ilike.%${query.trim()}%`)
        .eq('status', 'for sale')
        .limit(parseInt(limit) * 3); // Get more to deduplicate

      if (error) {
        console.error('Supabase error in searchLocations:', error);
        throw error;
      }

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
              display_text: `${row.zipcode} - ${row.area_level_4 || ''}, ${row.area_level_2 || ''}`,
              area_level_1: row.area_level_1,
              area_level_2: row.area_level_2,
              area_level_3: row.area_level_3,
              area_level_4: row.area_level_4,
              zipcode: row.zipcode,
              property_count: 1 // We'll calculate this properly if needed
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
              display_text: `${row.area_level_4}, ${row.area_level_2 || ''}`,
              area_level_1: row.area_level_1,
              area_level_2: row.area_level_2,
              area_level_3: row.area_level_3,
              area_level_4: row.area_level_4,
              property_count: 1
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
              display_text: `${row.area_level_3}, ${row.area_level_2 || ''}`,
              area_level_1: row.area_level_1,
              area_level_2: row.area_level_2,
              area_level_3: row.area_level_3,
              property_count: 1
            });
          }
        }

        // Add address suggestions
        if (row.address && row.address.toLowerCase().includes(query.toLowerCase())) {
          const key = `address-${row.address}`;
          if (!seen.has(key)) {
            seen.add(key);
            suggestions.push({
              type: 'address',
              value: row.address,
              display_text: row.address,
              area_level_1: row.area_level_1,
              area_level_2: row.area_level_2,
              area_level_3: row.area_level_3,
              area_level_4: row.area_level_4,
              zipcode: row.zipcode,
              property_count: 1
            });
          }
        }
      });

      // Limit results and sort by type priority
      const sortedSuggestions = suggestions
        .sort((a, b) => {
          const typePriority = { zipcode: 1, city: 2, area: 3, address: 4 };
          return typePriority[a.type] - typePriority[b.type];
        })
        .slice(0, parseInt(limit));

      res.json({
        success: true,
        data: sortedSuggestions,
        count: sortedSuggestions.length
      });
    } catch (error) {
      console.error('Search locations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search locations',
        error: error.message
      });
    }
  }

  /**
   * POST /properties/search/by-location
   * Get properties based on selected location
   */

  async searchByLocation(req, res) {
    try {
      const { location, filters = {} } = req.body;
    
      if (!location || !location.type || !location.value) {
        return res.status(400).json({
          success: false,
          message: 'Location data is required'
        });
      }

      // Build Supabase query based on location type
      let query = this.supabase
        .from('properties')
        .select('*')
        .eq('status', 'for sale');

      // Apply location filter
      switch (location.type) {
        case 'zipcode':
          if (location.zipcode) {
            query = query.eq('zipcode', location.zipcode);
          }
          break;
        case 'city':
          if (location.area_level_4) {
            query = query.eq('area_level_4', location.area_level_4);
          }
          break;
        case 'area':
          if (location.area_level_3) {
            query = query.eq('area_level_3', location.area_level_3);
          }
          break;
        case 'address':
          query = query.ilike('address', `%${location.value}%`);
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid location type'
          });
      }

      // Apply additional filters
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

      // Apply ordering and limit
      query = query.order('createdat', { ascending: false }).limit(50);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error in searchByLocation:', error);
        throw error;
      }

      res.json({
        success: true,
        data: data || [],
        count: data ? data.length : 0,
        location: {
          type: location.type,
          display_text: location.display_text || location.value,
          value: location.value
        }
      });
    } catch (error) {
      console.error('Search by location error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search properties by location',
        error: error.message
      });
    }
  }
/**
   * GET /properties/search/address
   * Search properties by address query
   */
  async searchPropertiesByAddress(req, res) {
    try {
      const { q: query, limit = 50 } = req.query;
      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Query parameter "q" is required and must be at least 2 characters',
          properties: [],
          count: 0
        });
      }

      const result = await this.propertyService.searchPropertiesByAddress(query, {}, parseInt(limit));
      res.json({
        success: true,
        properties: result.properties,
        count: result.count,
        location: result.location
      });
    } catch (error) {
      console.error('Search properties by address error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search properties by address',
        error: error.message,
        properties: [],
        count: 0
      });
    }
  }

  /**
   * GET /properties/search/popular-locations
   * Get popular locations for initial suggestions
   */
  async getPopularLocations(req, res) {
    try {
      const { limit = 20 } = req.query;

      // Get popular locations using Supabase
      const { data, error } = await this.supabase
        .from('properties')
        .select('area_level_1, area_level_2, area_level_3, area_level_4, zipcode')
        .eq('status', 'for sale')
        .not('area_level_4', 'is', null)
        .limit(parseInt(limit) * 3); // Get more to process

      if (error) {
        console.error('Supabase error in getPopularLocations:', error);
        throw error;
      }

      // Count occurrences and create popular locations
      const locationCounts = {};
      
      data.forEach(row => {
        if (row.area_level_4) {
          const key = `${row.area_level_4}-${row.area_level_2}`;
          if (!locationCounts[key]) {
            locationCounts[key] = {
              type: 'city',
              value: row.area_level_4,
              display_text: `${row.area_level_4}, ${row.area_level_2 || ''}`,
              area_level_1: row.area_level_1,
              area_level_2: row.area_level_2,
              area_level_3: row.area_level_3,
              area_level_4: row.area_level_4,
              property_count: 0
            };
          }
          locationCounts[key].property_count++;
        }
      });

      // Sort by count and return top results
      const popularLocations = Object.values(locationCounts)
        .sort((a, b) => b.property_count - a.property_count)
        .slice(0, parseInt(limit));

      res.json({
        success: true,
        data: popularLocations,
        count: popularLocations.length
      });
    } catch (error) {
      console.error('Get popular locations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get popular locations',
        error: error.message
      });
    }
  }

  /**
   * GET /properties/search/suggestions/:type
   * Get specific type suggestions (cities, areas, zipcodes)
   */

  async getLocationSuggestions(req, res) {
    try {
      const { type } = req.params;
      const { limit = 50 } = req.query;

      let data;
      
      switch (type) {
        case 'cities':
          const { data: citiesData, error: citiesError } = await this.supabase
            .from('properties')
            .select('area_level_1, area_level_2, area_level_3, area_level_4')
            .eq('status', 'for sale')
            .not('area_level_4', 'is', null)
            .limit(limit);
          
          if (citiesError) throw citiesError;
          data = citiesData;
          break;
          
        case 'areas':
          const { data: areasData, error: areasError } = await this.supabase
            .from('properties')
            .select('area_level_1, area_level_2, area_level_3')
            .eq('status', 'for sale')
            .not('area_level_3', 'is', null)
            .limit(limit);
          
          if (areasError) throw areasError;
          data = areasData;
          break;
          
        case 'zipcodes':
          const { data: zipData, error: zipError } = await this.supabase
            .from('properties')
            .select('zipcode, area_level_1, area_level_2, area_level_3, area_level_4')
            .eq('status', 'for sale')
            .not('zipcode', 'is', null)
            .limit(limit);
          
          if (zipError) throw zipError;
          data = zipData;
          break;
          
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid suggestion type. Use: cities, areas, or zipcodes'
          });
      }

      res.json({
        success: true,
        data: data,
        count: data.length,
        type: type
      });
    } catch (error) {
      console.error('Get suggestions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get suggestions',
        error: error.message
      });
    }
  }

  /**
   * GET /properties - Get all properties with optional filtering
   */
  async getAllProperties(req, res) {
    try {
      // Debug logging
      console.log('getAllProperties called');
      console.log('PropertyService available:', !!this.propertyService);
      console.log('PropertyRepo available:', !!this.propertyRepo);

      const {
        title,
        minPrice,
        maxPrice,
        address,
        layout,
        minArea,
        maxArea,
        propertyType,
        petsAllowed,
        transportation,
        yearBuilt,
        sortBy = 'id',
        sortOrder = 'DESC',
        limit = 20,
        offset = 0
      } = req.query;

      // Parse boolean values
      const parsedPetsAllowed = petsAllowed ? petsAllowed === 'true' : null;

      // Create search parameters
      const searchParams = {
        title,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        address,
        layout,
        minArea: minArea ? Number(minArea) : null,
        maxArea: maxArea ? Number(maxArea) : null,
        propertyType,
        petsAllowed: parsedPetsAllowed,
        transportation,
        yearBuilt,
        sortBy,
        sortOrder,
        limit: Math.min(Number(limit) || 20, 100), // Cap at 100
        offset: Number(offset) || 0
      };

      let result;

      // Temporarily bypass service and use direct repository with simple search
      console.log('Using direct repository with simpleSearch...');
      
      let repoResult;
      
      try {
        // Try simpleSearch method first
        repoResult = await this.propertyRepo.simpleSearch({
          limit: searchParams.limit,
          offset: searchParams.offset
        });
      } catch (simpleSearchError) {
        console.log('simpleSearch failed, using direct query:', simpleSearchError.message);
        
        // Fallback to direct database query
        const pool = this.propertyRepo.getPool();
        const directQuery = `
          SELECT 
            id,
            title,
            price,
            pricepersquaremeter as "pricePerSquareMeter",
            address,
            layout,
            area,
            floorinfo as "floorInfo",
            structure,
            managementfee as "managementFee",
            areaofuse as "areaOfUse",
            transportation,
            ST_AsGeoJSON(location)::jsonb AS location,
            propertytype as "propertyType",
            yearbuilt as "yearBuilt",
            balconyarea as "balconyArea",
            totalunits as "totalUnits",
            repairreservefund as "repairReserveFund",
            landleasefee as "landLeaseFee",
            rightfee as "rightFee",
            depositguarantee as "depositGuarantee",
            maintenancefees as "maintenanceFees",
            otherfees as "otherFees",
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
          ORDER BY createdat DESC
          LIMIT $1 OFFSET $2
        `;
        
        const countQuery = 'SELECT COUNT(*) as total FROM properties';
        
        const [directResult, countResult] = await Promise.all([
          pool.query(directQuery, [searchParams.limit, searchParams.offset]),
          pool.query(countQuery)
        ]);
        
        const total = parseInt(countResult.rows[0].total);
        
        repoResult = {
          properties: directResult.rows,
          pagination: {
            total,
            count: directResult.rows.length,
            hasMore: searchParams.offset + directResult.rows.length < total,
            offset: searchParams.offset,
            limit: searchParams.limit
          }
        };
      }
      
      // Helper function to handle fee fields that should be null for empty strings
      const processFeeField = (value) => {
        if (value === null || value === '' || value === undefined) {
          return null;
        }
        const numValue = parseFloat(value);
        return isNaN(numValue) ? null : numValue;
      };
      
      // Process properties with complete field mapping for frontend
      const properties = repoResult.properties.map(propData => ({
        id: propData.id,
        title: propData.title || '',
        price: parseFloat(propData.price) || 0,
        pricePerSquareMeter: parseFloat(propData.pricePerSquareMeter) || 0,
        address: propData.address || '',
        layout: propData.layout || '',
        area: parseFloat(propData.area) || 0,
        floorInfo: propData.floorInfo || '',
        structure: propData.structure || '',
        managementFee: parseFloat(propData.managementFee) || 0,
        areaOfUse: propData.areaOfUse || '',
        transportation: propData.transportation || '',
        location: propData.location || null,
        propertyType: propData.propertyType || '',
        yearBuilt: propData.yearBuilt || '',
        balconyArea: parseFloat(propData.balconyArea) || 0,
        totalUnits: parseInt(propData.totalUnits) || 0,
        repairReserveFund: parseFloat(propData.repairReserveFund) || 0,
        
        // Fixed fee fields - these will now return null for empty strings
        landLeaseFee: processFeeField(propData.landLeaseFee),
        rightFee: processFeeField(propData.rightFee),
        depositGuarantee: processFeeField(propData.depositGuarantee),
        otherFees: processFeeField(propData.otherFees),
        
        maintenanceFees: propData.maintenanceFees || '',
        bicycleParking: propData.bicycleParking || '',
        bikeStorage: propData.bikeStorage || '',
        siteArea: propData.siteArea || '',
        pets: propData.pets || '',
        landRights: propData.landRights || '',
        managementForm: propData.managementForm || '',
        landLawNotification: propData.landLawNotification || '',
        currentSituation: propData.currentSituation || '',
        extraditionPossibleDate: propData.extraditionPossibleDate || '',
        transactionMode: propData.transactionMode || '',
        propertyNumber: propData.propertyNumber || '',
        // Format date fields to YYYY-MM-DD strings
        informationReleaseDate: formatDateToString(propData.informationReleaseDate),
        nextScheduledUpdateDate: formatDateToString(propData.nextScheduledUpdateDate),
        remarks: propData.remarks || '',
        extraditionPossibleDate: formatDateToString(propData.extraditionPossibleDate),
        parking: propData.parking || '',
        kitchen: propData.kitchen || '',
        bathToilet: propData.bathToilet || '',
        facilitiesServices: propData.facilitiesServices || '',
        others: propData.others || '',
        images: propData.images || [],
        createdAt: propData.createdAt,
        updatedAt: propData.updatedAt
      }));

      result = {
        properties,
        pagination: repoResult.pagination || {},
        summary: {
          count: properties.length,
          averagePrice: properties.length > 0 
            ? Math.round(properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length)
            : 0,
          averageArea: properties.length > 0
            ? Math.round((properties.reduce((sum, p) => sum + (p.area || 0), 0) / properties.length) * 100) / 100
            : 0,
          priceRange: {
            min: properties.length > 0 ? Math.min(...properties.map(p => p.price)) : 0,
            max: properties.length > 0 ? Math.max(...properties.map(p => p.price)) : 0
          },
          areaRange: {
            min: properties.length > 0 ? Math.min(...properties.map(p => p.area)) : 0,
            max: properties.length > 0 ? Math.max(...properties.map(p => p.area)) : 0
          }
        }
      };

      // Ensure consistent response format
      res.json({
        success: true,
        data: Array.isArray(result.properties) ? result.properties : [],
        pagination: result.pagination || {},
        summary: result.summary || {},
        count: result.properties ? result.properties.length : 0
      });

    } catch (error) {
      console.error('Error in getAllProperties:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch properties',
        message: error.message,
        data: [],  // Always return empty array on error
        count: 0
      });
    }
  }
    /**
     * GET /properties/search - Advanced property search
     */
    async searchProperties(req, res) {
      try {
        // Create search object from query parameters
        const search = new PropertySearch(req.query);
        
        // Validate search parameters
        const validation = search.validate();
        if (!validation.isValid) {
          return res.status(400).json({
            success: false,
            errors: validation.errors
          });
        }

        // Perform search
        const result = await this.propertyRepo.search(search.toSearchParams());
        
        // Create collection
        const collection = new PropertyCollection(result.properties, result.pagination);

        res.json({
          success: true,
          data: collection.properties.map(prop => new Property(prop).toJSON()),
          pagination: collection.pagination,
          summary: collection.getSummary(),
          searchParams: search.toSearchParams()
        });

      } catch (error) {
        console.error('Error in searchProperties:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to search properties',
          message: error.message
        });
      }
    }

    /**
     * GET /properties/:id - Get property by ID
     */
    async getPropertyById(req, res) {
      try {
        const { id } = req.params;

        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Property ID is required'
          });
        }

        const propertyData = await this.propertyRepo.findById(id);
        
        if (!propertyData) {
          return res.status(404).json({
            success: false,
            error: 'Property not found'
          });
        }

        // Create Property instance for validation and computed fields
        const property = new Property(propertyData);

        res.json({
          success: true,
          data: property.toJSON()
        });

      } catch (error) {
        console.error(`Error fetching property ${req.params.id}:`, error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch property',
          message: error.message
        });
      }
    }

  /**
   * POST /properties - Create a new property
   */
  async createProperty(req, res) {
    try {
      // Create property from form data using factory
      const property = PropertyFactory.fromFormData(req.body, req.files || []);
      
      // Validate property data
      const validation = property.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
          warnings: validation.warnings
        });
      }

      // Additional custom validations
      const imageValidation = PropertyValidators.validateImages(property.images);
      if (!imageValidation.isValid) {
        return res.status(400).json({
          success: false,
          errors: imageValidation.errors
        });
      }

      // Create property in database
      const createdProperty = await this.propertyRepo.create(property.toJSON());
      
      // Return created property with computed fields
      const result = new Property(createdProperty);

      res.status(201).json({
        success: true,
        data: result.toJSON(),
        message: 'Property created successfully'
      });

    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create property',
        message: error.message
      });
    }
  }

  /**
   * PUT /properties/:id - Update a property
   */
  async updateProperty(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Property ID is required'
        });
      }

      // Check if property exists
      const exists = await this.propertyRepo.exists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          error: 'Property not found'
        });
      }

      // Process update data
      let updateData = { ...req.body };
      
      // Handle new images if uploaded
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => `/images/${file.filename}`);
        
        // Merge with existing images or replace
        if (req.body.replaceImages === 'true') {
          updateData.images = newImages;
        } else {
          // Get existing property to merge images
          const existingProperty = await this.propertyRepo.findById(id);
          const existingImages = existingProperty.images || [];
          updateData.images = [...existingImages, ...newImages];
        }
      }

      // Create property instance for validation
      const existingProperty = await this.propertyRepo.findById(id);
      const updatedProperty = new Property({
        ...existingProperty,
        ...updateData,
        id,
        updatedAt: new Date()
      });

      // Validate updated property
      const validation = updatedProperty.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
          warnings: validation.warnings
        });
      }

      // Update in database
      const result = await this.propertyRepo.update(id, updateData);
      
      // Return updated property
      const finalProperty = new Property(result);

      res.json({
        success: true,
        data: finalProperty.toJSON(),
        message: 'Property updated successfully'
      });

    } catch (error) {
      console.error(`Error updating property ${req.params.id}:`, error);
      
      if (error.message === 'Property not found') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update property',
        message: error.message
      });
    }
  }

  /**
   * DELETE /properties/:id - Delete a property
   */
  async deleteProperty(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Property ID is required'
        });
      }

      const deletedProperty = await this.propertyRepo.delete(id);

      res.json({
        success: true,
        data: deletedProperty,
        message: 'Property deleted successfully'
      });

    } catch (error) {
      console.error(`Error deleting property ${req.params.id}:`, error);
      
      if (error.message === 'Property not found') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to delete property',
        message: error.message
      });
    }
  }

  /**
   * POST /properties/filter - Filter properties (legacy endpoint)
   */
  async filterProperties(req, res) {
    try {
      const {
        minPrice,
        maxPrice,
        propertyType,
        layout,
        minArea,
        maxArea,
        yearBuilt
      } = req.body;

      // Validate filter parameters
      if (minPrice !== undefined && (isNaN(minPrice) || minPrice < 0)) {
        return res.status(400).json({
          success: false,
          error: 'minPrice must be a positive number',
          data: []
        });
      }

      if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice < 0)) {
        return res.status(400).json({
          success: false,
          error: 'maxPrice must be a positive number',
          data: []
        });
      }

      if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        return res.status(400).json({
          success: false,
          error: 'minPrice cannot be greater than maxPrice',
          data: []
        });
      }

      // Use service filter method
      const result = await this.propertyService.filterProperties(req.body);

      res.json({
        success: true,
        data: Array.isArray(result.properties) ? result.properties : [],
        summary: result.summary || {},
        count: result.properties ? result.properties.length : 0,
        filterApplied: req.body
      });

    } catch (error) {
      console.error('Error filtering properties:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to filter properties',
        message: error.message,
        data: []  // Always return empty array on error
      });
    }
  }

  /**
   * GET /properties/statistics - Get property statistics
   */
  async getStatistics(req, res) {
    try {
      const stats = await this.propertyRepo.getStatistics();
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
        message: error.message
      });
    }
  }

  /**
   * GET /properties/layouts - Get available layouts
   */
  async getLayouts(req, res) {
    try {
      const layouts = await this.propertyRepo.getDistinctLayouts();
      
      res.json({
        success: true,
        data: layouts
      });

    } catch (error) {
      console.error('Error fetching layouts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch layouts',
        message: error.message
      });
    }
  }

  /**
   * GET /properties/property-types - Get available property types
   */
  async getPropertyTypes(req, res) {
    try {
      const types = await this.propertyRepo.getDistinctPropertyTypes();
      
      res.json({
        success: true,
        data: types
      });

    } catch (error) {
      console.error('Error fetching property types:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch property types',
        message: error.message
      });
    }
  }

  /**
   * GET /properties/enums - Get all enums for frontend
   */
  async getEnums(req, res) {
    try {
      res.json({
        success: true,
        data: {
          propertyTypes: PropertyEnums.PROPERTY_TYPES,
          layouts: PropertyEnums.LAYOUTS,
          transactionModes: PropertyEnums.TRANSACTION_MODES,
          managementForms: PropertyEnums.MANAGEMENT_FORMS,
          landRights: PropertyEnums.LAND_RIGHTS,
          priceRanges: PropertyEnums.PRICE_RANGES,
          sortOptions: PropertyEnums.SORT_OPTIONS
        }
      });

    } catch (error) {
      console.error('Error fetching enums:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch enums',
        message: error.message
      });
    }
  }

  /**
   * GET /properties/:id/exists - Check if property exists
   */
  async checkPropertyExists(req, res) {
    try {
      const { id } = req.params;
      const exists = await this.propertyRepo.exists(id);
      
      res.json({
        success: true,
        exists
      });

    } catch (error) {
      console.error(`Error checking property existence for ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to check property existence',
        message: error.message
      });
    }
  }

  /**
   * POST /properties/bulk-import - Bulk import from CSV
   */
  async bulkImport(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'CSV file is required'
        });
      }

      // This is a placeholder for CSV import logic
      // You would implement CSV parsing and bulk creation here
      res.json({
        success: true,
        message: 'Bulk import feature coming soon',
        file: req.file.filename
      });

    } catch (error) {
      console.error('Error in bulk import:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to import properties',
        message: error.message
      });
    }
  }

  /**
   * DEBUG: Get raw database data
   */
async debugRaw(req, res) {
    try {
      console.log('🔍 Debug raw called');
      
      const { data, error } = await this.supabase
        .from('properties')
        .select('*')
        .limit(10);
      
      if (error) throw error;
      
      res.json({
        success: true,
        rawData: data,
        count: data.length,
        message: `Found ${data.length} raw records`
      });
      
    } catch (error) {
      console.error('Debug raw error:', error);
      res.json({
        success: false,
        error: error.message,
        message: 'Database query failed'
      });
    }
  }

  /**
   * DEBUG: Get count and test repository
   */
  async debugCount(req, res) {
    try {
      console.log('🔍 Debug count called');
      
      // Test repository methods
      const count = await this.propertyRepo.count();
      console.log('Repository count:', count);
      
      // Test repository search
      const searchResult = await this.propertyRepo.search({ limit: 5 });
      console.log('Repository search result:', {
        propertiesLength: searchResult.properties?.length,
        paginationTotal: searchResult.pagination?.total
      });
      
      res.json({
        success: true,
        repositoryCount: count,
        searchResult: {
          propertiesCount: searchResult.properties?.length || 0,
          properties: searchResult.properties || [],
          pagination: searchResult.pagination || {}
        }
      });
      
    } catch (error) {
      console.error('Debug count error:', error);
      res.json({
        success: false,
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Error handling middleware for this router
   */
  setupErrorHandling() {
    this.router.use((error, req, res, next) => {
      console.error('PropertyRoutes error:', error);

      // Handle multer errors
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File size too large. Maximum 5MB per file.'
          });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            error: 'Too many files. Maximum 20 files allowed.'
          });
        }
      }

      // Handle file type errors
      if (error.message === 'Only image files are allowed') {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      // Generic error
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    });
  }

  /**
   * Get the Express router
   * @returns {express.Router} Configured router
   */
  getRouter() {
    this.setupErrorHandling();
    return this.router;
  }
}

export default PropertyRoutes;