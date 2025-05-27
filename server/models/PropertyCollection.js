// models/PropertyCollection.js
/**
 * PropertyCollection - Handles collections of properties with pagination
 */
import { Property } from "./Property.js";

class PropertyCollection {
  constructor(properties = [], pagination = {}) {
    this.properties = properties.map(prop => 
      prop instanceof Property ? prop : new Property(prop)
    );
    
    this.pagination = {
      total: pagination.total || 0,
      count: pagination.count || this.properties.length,
      hasMore: pagination.hasMore || false,
      offset: pagination.offset || 0,
      limit: pagination.limit || 20,
      page: pagination.page || 1,
      totalPages: pagination.totalPages || Math.ceil((pagination.total || 0) / (pagination.limit || 20))
    };
  }

  /**
   * Get properties as JSON array
   * @returns {Array} Array of property JSON objects
   */
  toJSON() {
    return {
      properties: this.properties.map(prop => prop.toJSON()),
      pagination: this.pagination,
      summary: this.getSummary()
    };
  }

  /**
   * Get collection summary
   * @returns {Object} Summary statistics
   */
  getSummary() {
    if (this.properties.length === 0) {
      return {
        count: 0,
        averagePrice: 0,
        averageArea: 0,
        priceRange: { min: 0, max: 0 },
        areaRange: { min: 0, max: 0 }
      };
    }

    const prices = this.properties.map(p => p.price).filter(p => p > 0);
    const areas = this.properties.map(p => p.area).filter(a => a > 0);

    return {
      count: this.properties.length,
      averagePrice: prices.length > 0 
        ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length)
        : 0,
      averageArea: areas.length > 0
        ? Math.round(areas.reduce((sum, a) => sum + a, 0) / areas.length * 100) / 100
        : 0,
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0
      },
      areaRange: {
        min: areas.length > 0 ? Math.min(...areas) : 0,
        max: areas.length > 0 ? Math.max(...areas) : 0
      }
    };
  }

  /**
   * Filter properties by criteria
   * @param {Function} filterFn - Filter function
   * @returns {PropertyCollection} New filtered collection
   */
  filter(filterFn) {
    const filteredProperties = this.properties.filter(filterFn);
    return new PropertyCollection(filteredProperties, {
      ...this.pagination,
      count: filteredProperties.length,
      total: filteredProperties.length
    });
  }

  /**
   * Sort properties
   * @param {Function} sortFn - Sort function
   * @returns {PropertyCollection} New sorted collection
   */
  sort(sortFn) {
    const sortedProperties = [...this.properties].sort(sortFn);
    return new PropertyCollection(sortedProperties, this.pagination);
  }

  /**
   * Get property IDs
   * @returns {Array<string>} Array of property IDs
   */
  getIds() {
    return this.properties.map(prop => prop.id).filter(id => id);
  }

  /**
   * Find property by ID
   * @param {string} id - Property ID
   * @returns {Property|null} Property or null if not found
   */
  findById(id) {
    return this.properties.find(prop => prop.id === id) || null;
  }

  /**
   * Check if collection is empty
   * @returns {boolean} True if empty
   */
  isEmpty() {
    return this.properties.length === 0;
  }

  /**
   * Get first property
   * @returns {Property|null} First property or null
   */
  first() {
    return this.properties.length > 0 ? this.properties[0] : null;
  }

  /**
   * Get last property
   * @returns {Property|null} Last property or null
   */
  last() {
    return this.properties.length > 0 ? this.properties[this.properties.length - 1] : null;
  }
}

export { PropertyCollection };