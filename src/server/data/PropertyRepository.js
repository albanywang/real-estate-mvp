// data/PropertyRepository.js
// handle data base connection
// the Repository pattern is often used in larger applications to abstract database operations. 
// It acts as an intermediary between the Controller (or services) and the Model, 
// encapsulating data access logic (e.g., queries, CRUD operations).
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

class PropertyRepository {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
    this.tableName = 'properties';
  }

  // Add search locations method
  async searchLocations(query, limit = 10) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('area_level_1, area_level_2, area_level_3, area_level_4, zipcode')
      .or(`area_level_4.ilike.%${query}%,area_level_3.ilike.%${query}%,zipcode.ilike.%${query}%`)
      .eq('status', 'for sale')
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
  
  // Add simple search method
  async simpleSearch({ limit = 20, offset = 0 }) {
    const { data, error, count } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .order('createdat', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      properties: data,
      pagination: {
        total: count,
        count: data.length,
        hasMore: offset + data.length < count,
        offset,
        limit
      }
    };
  }  
  
  async count() {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count;
  }

  // Add exists method
  async exists(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }

    // Add findById method
  async findById(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
  
  /**
   * Get all properties with optional filtering
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Array of properties
   */
  async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          id,
          title,
          price,
          pricePerSquareMeter,
          address,
          layout,
          area,
          floorInfo,
          structure,
          managementFee,
          areaOfUse,
          transportation,
          ST_AsGeoJSON(location)::jsonb AS location,
          propertyType,
          yearBuilt,
          balconyArea,
          totalUnits,
          repairReserveFund,
          landLeaseFee,
          rightFee,
          depositGuarantee,
          maintenanceFees,
          otherFees,
          bicycleParking,
          bikeStorage,
          siteArea,
          pets,
          landRights,
          managementForm,
          landLawNotification,
          currentSituation,
          extraditionPossibleDate,
          transactionMode,
          propertyNumber,
          informationReleaseDate,
          nextScheduledUpdateDate,
          remarks,
          evaluationCertificate,
          parking,
          kitchen,
          bathToilet,
          facilitiesServices,
          others,
          images,
          createdAt,
          updatedAt
        FROM properties
        WHERE 1=1
      `;
      
      const params = [];
      let paramIndex = 1;

      // Handle text search (title)
      if (filters.title) {
        query += ` AND title ILIKE $${paramIndex}`;
        params.push(`%${filters.title}%`);
        paramIndex++;
      }

      // Handle address search
      if (filters.address) {
        query += ` AND address ILIKE $${paramIndex}`;
        params.push(`%${filters.address}%`);
        paramIndex++;
      }

      // Handle price range
      if (filters.minPrice) {
        query += ` AND price >= $${paramIndex}`;
        params.push(Number(filters.minPrice));
        paramIndex++;
      }

      if (filters.maxPrice) {
        query += ` AND price <= $${paramIndex}`;
        params.push(Number(filters.maxPrice));
        paramIndex++;
      }

      // Handle area range
      if (filters.minArea) {
        query += ` AND area >= $${paramIndex}`;
        params.push(Number(filters.minArea));
        paramIndex++;
      }

      if (filters.maxArea) {
        query += ` AND area <= $${paramIndex}`;
        params.push(Number(filters.maxArea));
        paramIndex++;
      }

      // Handle exact matches
      if (filters.propertyType) {
        query += ` AND propertyType = $${paramIndex}`;
        params.push(filters.propertyType);
        paramIndex++;
      }

      if (filters.layout) {
        query += ` AND layout = $${paramIndex}`;
        params.push(filters.layout);
        paramIndex++;
      }

      // Handle boolean filters
      if (filters.petsAllowed !== null && filters.petsAllowed !== undefined) {
        query += ` AND pets = $${paramIndex}`;
        params.push(filters.petsAllowed);
        paramIndex++;
      }

      // Handle transportation filter
      if (filters.transportation) {
        query += ` AND transportation ILIKE $${paramIndex}`;
        params.push(`%${filters.transportation}%`);
        paramIndex++;
      }

      // Handle year built
      if (filters.yearBuilt) {
        query += ` AND yearBuilt LIKE $${paramIndex}`;
        params.push(`%${filters.yearBuilt}%`);
        paramIndex++;
      }

      // Add ordering
      query += ` ORDER BY id DESC`;

      // Execute the query
      const result = await this.pool.query(query, params);
      
      // Process properties to ensure location is properly formatted
      const properties = result.rows.map(property => ({
        ...property,
        location: this.processLocationData(property.location)
      }));

      return properties;
    } catch (error) {
      console.error('Error in PropertyRepository.findAll:', error);
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }
  }

  /**
   * Find properties with advanced search options including pagination
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Object containing properties array and pagination info
   */
  async search(searchParams = {}) {
    try {
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
        sortBy = 'createdat',
        sortOrder = 'DESC',
        limit = 20,
        offset = 0
      } = searchParams;

      // Build the base query with column name mapping
      let query = `
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
        WHERE 1=1
      `;

      const params = [];
      let paramIndex = 1;

      // Apply filters using actual database column names
      if (title) {
        query += ` AND title ILIKE ${paramIndex}`;
        params.push(`%${title}%`);
        paramIndex++;
      }

      if (address) {
        query += ` AND address ILIKE ${paramIndex}`;
        params.push(`%${address}%`);
        paramIndex++;
      }

      if (minPrice) {
        query += ` AND price::numeric >= ${paramIndex}`;
        params.push(Number(minPrice));
        paramIndex++;
      }

      if (maxPrice) {
        query += ` AND price::numeric <= ${paramIndex}`;
        params.push(Number(maxPrice));
        paramIndex++;
      }

      if (minArea) {
        query += ` AND area::numeric >= ${paramIndex}`;
        params.push(Number(minArea));
        paramIndex++;
      }

      if (maxArea) {
        query += ` AND area::numeric <= ${paramIndex}`;
        params.push(Number(maxArea));
        paramIndex++;
      }

      if (propertyType) {
        query += ` AND propertytype = ${paramIndex}`;
        params.push(propertyType);
        paramIndex++;
      }

      if (layout) {
        query += ` AND layout = ${paramIndex}`;
        params.push(layout);
        paramIndex++;
      }

      if (petsAllowed !== null && petsAllowed !== undefined) {
        query += ` AND pets = ${paramIndex}`;
        params.push(petsAllowed ? '可' : '不可');
        paramIndex++;
      }

      if (transportation) {
        query += ` AND transportation ILIKE ${paramIndex}`;
        params.push(`%${transportation}%`);
        paramIndex++;
      }

      if (yearBuilt) {
        query += ` AND yearbuilt LIKE ${paramIndex}`;
        params.push(`%${yearBuilt}%`);
        paramIndex++;
      }

      // Get total count for pagination
      const countQuery = query.replace(
        /SELECT[\s\S]*?FROM properties/,
        'SELECT COUNT(*) as total FROM properties'
      );
      const countResult = await this.pool.query(countQuery, params);
      const total = parseInt(countResult.rows[0].total);

      // Add sorting and pagination to main query
      const validSortColumns = [
        'createdat', 'updatedat', 'price', 'area', 'title', 'yearbuilt'
      ];
      const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'createdat';
      const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      
      query += ` ORDER BY ${sortColumn} ${order}`;
      query += ` LIMIT ${paramIndex} OFFSET ${paramIndex + 1}`;
      params.push(limit, offset);

      // Execute the main query
      const result = await this.pool.query(query, params);

      // Process properties
      const properties = result.rows.map(property => ({
        ...property,
        location: this.processLocationData(property.location)
      }));

      return {
        properties,
        pagination: {
          total,
          count: properties.length,
          hasMore: offset + properties.length < total,
          offset,
          limit,
          page: Math.floor(offset / limit) + 1,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in PropertyRepository.search:', error);
      throw new Error(`Failed to search properties: ${error.message}`);
    }
  }

  /**
   * Find a property by ID
   * @param {string} id - Property ID
   * @returns {Promise<Object|null>} Property object or null if not found
   */
  async findById(id) {
    try {
      const query = `
        SELECT 
          id,
          title,
          price,
          pricePerSquareMeter,
          address,
          layout,
          area,
          floorInfo,
          structure,
          managementFee,
          areaOfUse,
          transportation,
          ST_AsGeoJSON(location)::jsonb AS location,
          propertyType,
          yearBuilt,
          balconyArea,
          totalUnits,
          repairReserveFund,
          landLeaseFee,
          rightFee,
          depositGuarantee,
          maintenanceFees,
          otherFees,
          bicycleParking,
          bikeStorage,
          siteArea,
          pets,
          landRights,
          managementForm,
          landLawNotification,
          currentSituation,
          extraditionPossibleDate,
          transactionMode,
          propertyNumber,
          informationReleaseDate,
          nextScheduledUpdateDate,
          remarks,
          evaluationCertificate,
          parking,
          kitchen,
          bathToilet,
          facilitiesServices,
          others,
          images,
          createdAt,
          updatedAt
        FROM properties
        WHERE id = $1
      `;
      
      const result = await this.pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const property = result.rows[0];
      
      return {
        ...property,
        location: this.processLocationData(property.location)
      };
    } catch (error) {
      console.error(`Error in PropertyRepository.findById for ID ${id}:`, error);
      throw new Error(`Failed to fetch property: ${error.message}`);
    }
  }

  /**
   * Create a new property
   * @param {Object} propertyData - Property data
   * @returns {Promise<Object>} Created property
   */
  async create(propertyData) {
    try {
      // Destructure all the fields from propertyData
      const {
        title, price, pricePerSquareMeter, address, layout, area, floorInfo, structure,
        managementFee, areaOfUse, transportation, propertyType, yearBuilt,
        balconyArea, totalUnits, repairReserveFund, landLeaseFee, rightFee,
        depositGuarantee, maintenanceFees, otherFees, bicycleParking, bikeStorage,
        siteArea, pets, landRights, managementForm, landLawNotification,
        currentSituation, extraditionPossibleDate, transactionMode, propertyNumber,
        informationReleaseDate, nextScheduledUpdateDate, remarks, evaluationCertificate,
        parking, kitchen, bathToilet, facilitiesServices, others, images,
        lat, lng, location
      } = propertyData;

      // Process location data
      let processedLocation = null;
      if (location) {
        processedLocation = location;
      } else if (lat && lng) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        
        if (!isNaN(latitude) && !isNaN(longitude)) {
          processedLocation = [latitude, longitude];
        }
      }

      const query = `
        INSERT INTO properties (
          title, price, pricePerSquareMeter, address, layout, area, floorInfo, structure,
          managementFee, areaOfUse, transportation, location, propertyType, yearBuilt,
          balconyArea, totalUnits, repairReserveFund, landLeaseFee, rightFee,
          depositGuarantee, maintenanceFees, otherFees, bicycleParking, bikeStorage,
          siteArea, pets, landRights, managementForm, landLawNotification,
          currentSituation, extraditionPossibleDate, transactionMode, propertyNumber,
          informationReleaseDate, nextScheduledUpdateDate, remarks, evaluationCertificate,
          parking, kitchen, bathToilet, facilitiesServices, others, images
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36,
          $37, $38, $39, $40, $41, $42
        ) RETURNING *
      `;

      const values = [
        title,
        price ? parseInt(price) : null,
        pricePerSquareMeter ? parseFloat(pricePerSquareMeter) : null,
        address,
        layout,
        area ? parseFloat(area) : null,
        floorInfo,
        structure,
        managementFee ? parseInt(managementFee) : null,
        areaOfUse,
        transportation,
        processedLocation,
        propertyType,
        yearBuilt,
        balconyArea ? parseFloat(balconyArea) : null,
        totalUnits ? parseInt(totalUnits) : null,
        repairReserveFund ? parseInt(repairReserveFund) : null,
        landLeaseFee ? parseInt(landLeaseFee) : null,
        rightFee ? parseInt(rightFee) : null,
        depositGuarantee ? parseInt(depositGuarantee) : null,
        maintenanceFees ? parseInt(maintenanceFees) : null,
        otherFees ? parseInt(otherFees) : null,
        bicycleParking,
        bikeStorage,
        siteArea ? parseFloat(siteArea) : null,
        pets,
        landRights,
        managementForm,
        landLawNotification,
        currentSituation,
        extraditionPossibleDate,
        transactionMode,
        propertyNumber,
        informationReleaseDate,
        nextScheduledUpdateDate,
        remarks,
        evaluationCertificate,
        parking,
        kitchen,
        bathToilet,
        facilitiesServices,
        others,
        images || []
      ];

      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error in PropertyRepository.create:', error);
      throw new Error(`Failed to create property: ${error.message}`);
    }
  }

  /**
   * Update a property
   * @param {string} id - Property ID
   * @param {Object} propertyData - Updated property data
   * @returns {Promise<Object>} Updated property
   */
  async update(id, propertyData) {
    try {
      // First check if property exists
      const existingProperty = await this.findById(id);
      if (!existingProperty) {
        throw new Error('Property not found');
      }

      // Build dynamic update query based on provided fields
      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      // List of all possible fields that can be updated
      const updatableFields = [
        'title', 'price', 'pricePerSquareMeter', 'address', 'layout', 'area', 'floorInfo', 'structure',
        'managementFee', 'areaOfUse', 'transportation', 'propertyType', 'yearBuilt',
        'balconyArea', 'totalUnits', 'repairReserveFund', 'landLeaseFee', 'rightFee',
        'depositGuarantee', 'maintenanceFees', 'otherFees', 'bicycleParking', 'bikeStorage',
        'siteArea', 'pets', 'landRights', 'managementForm', 'landLawNotification',
        'currentSituation', 'extraditionPossibleDate', 'transactionMode', 'propertyNumber',
        'informationReleaseDate', 'nextScheduledUpdateDate', 'remarks', 'evaluationCertificate',
        'parking', 'kitchen', 'bathToilet', 'facilitiesServices', 'others', 'images'
      ];

      // Process each field that's being updated
      for (const field of updatableFields) {
        if (propertyData.hasOwnProperty(field)) {
          updateFields.push(`${field} = $${paramIndex}`);
          
          // Handle special data type conversions
          let value = propertyData[field];
          if (['price', 'managementFee', 'totalUnits', 'repairReserveFund', 'landLeaseFee', 
               'rightFee', 'depositGuarantee', 'maintenanceFees', 'otherFees'].includes(field)) {
            value = value ? parseInt(value) : null;
          } else if (['pricePerSquareMeter', 'area', 'balconyArea', 'siteArea'].includes(field)) {
            value = value ? parseFloat(value) : null;
          }
          
          values.push(value);
          paramIndex++;
        }
      }

      // Handle location separately if provided
      if (propertyData.lat && propertyData.lng) {
        const latitude = parseFloat(propertyData.lat);
        const longitude = parseFloat(propertyData.lng);
        
        if (!isNaN(latitude) && !isNaN(longitude)) {
          updateFields.push(`location = $${paramIndex}`);
          values.push([latitude, longitude]);
          paramIndex++;
        }
      } else if (propertyData.location) {
        updateFields.push(`location = $${paramIndex}`);
        values.push(propertyData.location);
        paramIndex++;
      }

      // Add updatedAt timestamp
      updateFields.push(`updatedAt = NOW()`);

      if (updateFields.length === 1) { // Only updatedAt was added
        throw new Error('No valid fields provided for update');
      }

      // Add the ID parameter
      values.push(id);

      const query = `
        UPDATE properties 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await this.pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Property not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error(`Error in PropertyRepository.update for ID ${id}:`, error);
      
      if (error.message === 'Property not found') {
        throw error;
      }
      
      throw new Error(`Failed to update property: ${error.message}`);
    }
  }

  /**
   * Delete a property
   * @param {string} id - Property ID
   * @returns {Promise<Object>} Deleted property
   */
  async delete(id) {
    try {
      const query = 'DELETE FROM properties WHERE id = $1 RETURNING *';
      const result = await this.pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Property not found');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error(`Error in PropertyRepository.delete for ID ${id}:`, error);
      
      if (error.message === 'Property not found') {
        throw error;
      }
      
      throw new Error(`Failed to delete property: ${error.message}`);
    }
  }

  /**
   * Filter properties (legacy method to match your existing filter endpoint)
   * @param {Object} filterParams - Filter parameters
   * @returns {Promise<Array>} Array of filtered properties
   */
  async filter(filterParams) {
    try {
      const {
        minPrice,
        maxPrice,
        propertyType,
        layout,
        minArea,
        maxArea,
        yearBuilt
      } = filterParams;

      let query = `
        SELECT 
          id,
          title,
          price,
          pricePerSquareMeter,
          address,
          layout,
          area,
          floorInfo,
          structure,
          managementFee,
          areaOfUse,
          transportation,
          ST_AsGeoJSON(location)::jsonb AS location,
          propertyType,
          yearBuilt,
          balconyArea,
          totalUnits,
          repairReserveFund,
          landLeaseFee,
          rightFee,
          depositGuarantee,
          maintenanceFees,
          otherFees,
          bicycleParking,
          bikeStorage,
          siteArea,
          pets,
          landRights,
          managementForm,
          landLawNotification,
          currentSituation,
          extraditionPossibleDate,
          transactionMode,
          propertyNumber,
          informationReleaseDate,
          nextScheduledUpdateDate,
          remarks,
          evaluationCertificate,
          parking,
          kitchen,
          bathToilet,
          facilitiesServices,
          others,
          images,
          createdAt,
          updatedAt
        FROM properties 
        WHERE 1=1
      `;
      
      const values = [];
      let paramIndex = 1;

      if (minPrice) {
        query += ` AND price >= $${paramIndex}`;
        values.push(parseInt(minPrice));
        paramIndex++;
      }

      if (maxPrice) {
        query += ` AND price <= $${paramIndex}`;
        values.push(parseInt(maxPrice));
        paramIndex++;
      }

      if (propertyType) {
        query += ` AND propertyType = $${paramIndex}`;
        values.push(propertyType);
        paramIndex++;
      }

      if (layout) {
        query += ` AND layout = $${paramIndex}`;
        values.push(layout);
        paramIndex++;
      }

      if (minArea) {
        query += ` AND area >= $${paramIndex}`;
        values.push(parseFloat(minArea));
        paramIndex++;
      }

      if (maxArea) {
        query += ` AND area <= $${paramIndex}`;
        values.push(parseFloat(maxArea));
        paramIndex++;
      }

      if (yearBuilt) {
        query += ` AND yearBuilt LIKE $${paramIndex}`;
        values.push(`%${yearBuilt}%`);
        paramIndex++;
      }

      query += ' ORDER BY id DESC';

      const result = await this.pool.query(query, values);

      // Process properties to ensure location is properly formatted
      const properties = result.rows.map(property => ({
        ...property,
        location: this.processLocationData(property.location)
      }));

      return properties;
    } catch (error) {
      console.error('Error in PropertyRepository.filter:', error);
      throw new Error(`Failed to filter properties: ${error.message}`);
    }
  }

  /**
   * Get distinct layouts from properties
   * @returns {Promise<Array>} Array of unique layouts
   */
  async getDistinctLayouts() {
    try {
      const result = await this.pool.query('SELECT DISTINCT layout FROM properties WHERE layout IS NOT NULL ORDER BY layout');
      return result.rows.map(row => row.layout);
    } catch (error) {
      console.error('Error in PropertyRepository.getDistinctLayouts:', error);
      throw new Error(`Failed to fetch layouts: ${error.message}`);
    }
  }

  /**
   * Get distinct property types from properties
   * @returns {Promise<Array>} Array of unique property types
   */
  async getDistinctPropertyTypes() {
    try {
      const result = await this.pool.query('SELECT DISTINCT propertyType FROM properties WHERE propertyType IS NOT NULL ORDER BY propertyType');
      return result.rows.map(row => row.propertyType);
    } catch (error) {
      console.error('Error in PropertyRepository.getDistinctPropertyTypes:', error);
      throw new Error(`Failed to fetch property types: ${error.message}`);
    }
  }

  /**
   * Get properties within a price range
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @returns {Promise<Array>} Array of properties
   */
  async findByPriceRange(minPrice, maxPrice) {
    try {
      const query = `
        SELECT * FROM properties
        WHERE price >= $1 AND price <= $2
        ORDER BY price ASC
      `;
      
      const result = await this.pool.query(query, [minPrice, maxPrice]);
      return result.rows.map(property => ({
        ...property,
        location: this.processLocationData(property.location)
      }));
    } catch (error) {
      console.error('Error in PropertyRepository.findByPriceRange:', error);
      throw new Error(`Failed to fetch properties by price range: ${error.message}`);
    }
  }

  /**
   * Get properties by type
   * @param {string} propertyType - Property type
   * @returns {Promise<Array>} Array of properties
   */
  async findByType(propertyType) {
    try {
      const query = `
        SELECT * FROM properties
        WHERE propertyType = $1
        ORDER BY id DESC
      `;
      
      const result = await this.pool.query(query, [propertyType]);
      return result.rows.map(property => ({
        ...property,
        location: this.processLocationData(property.location)
      }));
    } catch (error) {
      console.error('Error in PropertyRepository.findByType:', error);
      throw new Error(`Failed to fetch properties by type: ${error.message}`);
    }
  }

  /**
   * Get properties that allow pets
   * @param {boolean} petsAllowed - Whether pets are allowed
   * @returns {Promise<Array>} Array of properties
   */
  async findByPetPolicy(petsAllowed) {
    try {
      const query = `
        SELECT * FROM properties
        WHERE pets = $1
        ORDER BY id DESC
      `;
      
      const result = await this.pool.query(query, [petsAllowed]);
      return result.rows.map(property => ({
        ...property,
        location: this.processLocationData(property.location)
      }));
    } catch (error) {
      console.error('Error in PropertyRepository.findByPetPolicy:', error);
      throw new Error(`Failed to fetch properties by pet policy: ${error.message}`);
    }
  }

  /**
   * Get statistical data about properties
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics() {
    try {
      const query = `
        SELECT
          COUNT(*) as total_properties,
          AVG(price) as average_price,
          MIN(price) as min_price,
          MAX(price) as max_price,
          AVG(area) as average_area,
          MIN(area) as min_area,
          MAX(area) as max_area
        FROM properties
      `;
      
      const result = await this.pool.query(query);
      const stats = result.rows[0];
      
      return {
        totalProperties: parseInt(stats.total_properties),
        averagePrice: parseFloat(stats.average_price) || 0,
        minPrice: parseFloat(stats.min_price) || 0,
        maxPrice: parseFloat(stats.max_price) || 0,
        averageArea: parseFloat(stats.average_area) || 0,
        minArea: parseFloat(stats.min_area) || 0,
        maxArea: parseFloat(stats.max_area) || 0
      };
    } catch (error) {
      console.error('Error in PropertyRepository.getStatistics:', error);
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  }

  /**
   * Check if a property exists
   * @param {string} id - Property ID
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(id) {
    try {
      const result = await this.pool.query('SELECT 1 FROM properties WHERE id = $1', [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error(`Error in PropertyRepository.exists for ID ${id}:`, error);
      throw new Error(`Failed to check property existence: ${error.message}`);
    }
  }

  /**
   * Get properties count by filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Count of properties
   */
  async count(filters = {}) {
    try {
      let query = 'SELECT COUNT(*) as total FROM properties WHERE 1=1';
      const params = [];
      let paramIndex = 1;

      // Apply filters (same logic as findAll)
      if (filters.title) {
        query += ` AND title ILIKE ${paramIndex}`;
        params.push(`%${filters.title}%`);
        paramIndex++;
      }

      if (filters.propertyType) {
        query += ` AND propertyType = ${paramIndex}`;
        params.push(filters.propertyType);
        paramIndex++;
      }

      if (filters.minPrice) {
        query += ` AND price >= ${paramIndex}`;
        params.push(Number(filters.minPrice));
        paramIndex++;
      }

      if (filters.maxPrice) {
        query += ` AND price <= ${paramIndex}`;
        params.push(Number(filters.maxPrice));
        paramIndex++;
      }

      const result = await this.pool.query(query, params);
      return parseInt(result.rows[0].total);
    } catch (error) {
      console.error('Error in PropertyRepository.count:', error);
      throw new Error(`Failed to count properties: ${error.message}`);
    }
  }

  /**
   * Process location data to ensure consistent format
   * @param {*} location - Raw location data from database
   * @returns {Array|null} Processed location array or null
   */
  processLocationData(location) {
    if (!location) {
      return null;
    }

    // If it's already a GeoJSON object, extract coordinates
    if (typeof location === 'object' && location.coordinates) {
      return location.coordinates;
    }

    // If location is a PostgreSQL array string like "{lat,lng}"
    if (typeof location === 'string') {
      try {
        const cleanedLocation = location.replace('{', '[').replace('}', ']');
        const parsed = JSON.parse(cleanedLocation);
        if (Array.isArray(parsed)) {
          return parsed.map(val => typeof val === 'string' ? parseFloat(val) : val);
        }
      } catch (e) {
        console.warn('Failed to parse location string:', location);
        return null;
      }
    }

    // If it's already an array, ensure values are numbers
    if (Array.isArray(location)) {
      return location.map(val => typeof val === 'string' ? parseFloat(val) : val);
    }

    return location;
  }

  /**
   * Close the database connection pool
   */
  async close() {
    try {
      await this.pool.end();
    } catch (error) {
      console.error('Error closing database pool:', error);
    }
  }

  /**
   * Get database pool instance for custom queries
   * @returns {Pool} PostgreSQL pool instance
   */
  getPool() {
    return this.pool;
  }
}

export default PropertyRepository;