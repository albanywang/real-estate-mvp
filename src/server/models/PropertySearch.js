// models/PropertySearch.js
/**
 * PropertySearch - Handles search criteria and filters
 */
class PropertySearch {
  constructor(searchParams = {}) {
    // Text search
    this.title = searchParams.title || '';
    this.address = searchParams.address || '';
    
    // Price filters
    this.minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : null;
    this.maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : null;
    this.priceRange = searchParams.priceRange || null; // 'budget', 'mid', 'luxury'
    
    // Area filters
    this.minArea = searchParams.minArea ? Number(searchParams.minArea) : null;
    this.maxArea = searchParams.maxArea ? Number(searchParams.maxArea) : null;
    
    // Property characteristics
    this.propertyType = searchParams.propertyType || '';
    this.layout = searchParams.layout || '';
    this.yearBuilt = searchParams.yearBuilt || '';
    
    // Features
    this.petsAllowed = searchParams.petsAllowed !== undefined ? 
      Boolean(searchParams.petsAllowed) : null;
    this.parking = searchParams.parking || '';
    this.transportation = searchParams.transportation || '';
    
    // Location filters
    this.location = searchParams.location || null;
    this.radius = searchParams.radius ? Number(searchParams.radius) : null; // in km
    
    // Sorting and pagination
    this.sortBy = searchParams.sortBy || 'createdAt';
    this.sortOrder = searchParams.sortOrder || 'DESC';
    this.limit = searchParams.limit ? Number(searchParams.limit) : 20;
    this.offset = searchParams.offset ? Number(searchParams.offset) : 0;
    this.page = searchParams.page ? Number(searchParams.page) : 1;
  }

  /**
   * Validate search parameters
   * @returns {Object} Validation result
   */
  validate() {
    const errors = [];

    // Price validation
    if (this.minPrice !== null && (this.minPrice < 0 || !Number.isFinite(this.minPrice))) {
      errors.push('Minimum price must be a positive number');
    }

    if (this.maxPrice !== null && (this.maxPrice < 0 || !Number.isFinite(this.maxPrice))) {
      errors.push('Maximum price must be a positive number');
    }

    if (this.minPrice !== null && this.maxPrice !== null && this.minPrice > this.maxPrice) {
      errors.push('Minimum price cannot be greater than maximum price');
    }

    // Area validation
    if (this.minArea !== null && (this.minArea < 0 || !Number.isFinite(this.minArea))) {
      errors.push('Minimum area must be a positive number');
    }

    if (this.maxArea !== null && (this.maxArea < 0 || !Number.isFinite(this.maxArea))) {
      errors.push('Maximum area must be a positive number');
    }

    if (this.minArea !== null && this.maxArea !== null && this.minArea > this.maxArea) {
      errors.push('Minimum area cannot be greater than maximum area');
    }

    // Pagination validation
    if (this.limit < 1 || this.limit > 100) {
      errors.push('Limit must be between 1 and 100');
    }

    if (this.offset < 0) {
      errors.push('Offset must be non-negative');
    }

    if (this.page < 1) {
      errors.push('Page must be greater than 0');
    }

    // Sort validation
    const validSortFields = [
      'id', 'title', 'price', 'area', 'createdAt', 'updatedAt', 'yearBuilt'
    ];
    if (!validSortFields.includes(this.sortBy)) {
      errors.push(`Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    if (!['ASC', 'DESC'].includes(this.sortOrder.toUpperCase())) {
      errors.push('Sort order must be ASC or DESC');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert to filter object for repository
   * @returns {Object} Filter object
   */
  toFilters() {
    const filters = {};

    if (this.title) filters.title = this.title;
    if (this.address) filters.address = this.address;
    if (this.minPrice !== null) filters.minPrice = this.minPrice;
    if (this.maxPrice !== null) filters.maxPrice = this.maxPrice;
    if (this.minArea !== null) filters.minArea = this.minArea;
    if (this.maxArea !== null) filters.maxArea = this.maxArea;
    if (this.propertyType) filters.propertyType = this.propertyType;
    if (this.layout) filters.layout = this.layout;
    if (this.yearBuilt) filters.yearBuilt = this.yearBuilt;
    if (this.petsAllowed !== null) filters.petsAllowed = this.petsAllowed;
    if (this.transportation) filters.transportation = this.transportation;

    return filters;
  }

  /**
   * Convert to search parameters object for repository
   * @returns {Object} Search parameters object
   */
  toSearchParams() {
    return {
      ...this.toFilters(),
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      limit: this.limit,
      offset: this.offset
    };
  }

  /**
   * Apply price range preset
   * @param {string} range - 'budget', 'mid', 'luxury'
   */
  applyPriceRange(range) {
    const ranges = {
      budget: { min: 0, max: 500000 },
      mid: { min: 500000, max: 1500000 },
      luxury: { min: 1500000, max: null }
    };

    if (ranges[range]) {
      this.minPrice = ranges[range].min;
      this.maxPrice = ranges[range].max;
      this.priceRange = range;
    }
  }

  /**
   * Reset all filters
   */
  reset() {
    Object.keys(this).forEach(key => {
      if (key === 'sortBy') this[key] = 'createdAt';
      else if (key === 'sortOrder') this[key] = 'DESC';
      else if (key === 'limit') this[key] = 20;
      else if (key === 'offset') this[key] = 0;
      else if (key === 'page') this[key] = 1;
      else if (typeof this[key] === 'string') this[key] = '';
      else if (typeof this[key] === 'number') this[key] = null;
      else if (typeof this[key] === 'boolean') this[key] = null;
    });
  }
}

export { PropertySearch };