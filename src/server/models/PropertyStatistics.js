// models/PropertyStatistics.js
/**
 * PropertyStatistics - Handles property market statistics
 */
class PropertyStatistics {
  constructor(data = {}) {
    this.totalProperties = data.totalProperties || 0;
    this.averagePrice = data.averagePrice || 0;
    this.medianPrice = data.medianPrice || 0;
    this.minPrice = data.minPrice || 0;
    this.maxPrice = data.maxPrice || 0;
    this.averageArea = data.averageArea || 0;
    this.medianArea = data.medianArea || 0;
    this.minArea = data.minArea || 0;
    this.maxArea = data.maxArea || 0;
    this.averagePricePerSquareMeter = data.averagePricePerSquareMeter || 0;
    
    // Distribution by property type
    this.propertyTypeDistribution = data.propertyTypeDistribution || {};
    
    // Price ranges
    this.priceRanges = data.priceRanges || {
      budget: 0,    // under 500k
      mid: 0,       // 500k - 1.5M
      luxury: 0     // over 1.5M
    };
    
    // Trends (if available)
    this.trends = data.trends || {
      priceChange: 0,     // percentage change
      volumeChange: 0,    // percentage change in listings
      period: 'month'     // comparison period
    };
  }

  /**
   * Calculate price per square meter statistics
   * @returns {Object} Price per sqm statistics
   */
  getPricePerSquareMeterStats() {
    return {
      average: this.averagePricePerSquareMeter,
      estimated: this.averagePrice > 0 && this.averageArea > 0 
        ? Math.round((this.averagePrice / this.averageArea) * 100) / 100 
        : 0
    };
  }

  /**
   * Get market summary
   * @returns {Object} Market summary
   */
  getMarketSummary() {
    return {
      totalListings: this.totalProperties,
      priceRange: {
        min: this.minPrice,
        max: this.maxPrice,
        average: this.averagePrice
      },
      areaRange: {
        min: this.minArea,
        max: this.maxArea,
        average: this.averageArea
      },
      dominantPropertyType: this.getDominantPropertyType(),
      marketSegment: this.getMarketSegment()
    };
  }

  /**
   * Get dominant property type
   * @returns {string} Most common property type
   */
  getDominantPropertyType() {
    let maxCount = 0;
    let dominantType = 'unknown';
    
    for (const [type, count] of Object.entries(this.propertyTypeDistribution)) {
      if (count > maxCount) {
        maxCount = count;
        dominantType = type;
      }
    }
    
    return dominantType;
  }

  /**
   * Determine market segment based on average price
   * @returns {string} Market segment
   */
  getMarketSegment() {
    if (this.averagePrice < 500000) return 'budget';
    if (this.averagePrice < 1500000) return 'mid-range';
    return 'luxury';
  }

  /**
   * Convert to JSON
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      totalProperties: this.totalProperties,
      averagePrice: this.averagePrice,
      medianPrice: this.medianPrice,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      averageArea: this.averageArea,
      medianArea: this.medianArea,
      minArea: this.minArea,
      maxArea: this.maxArea,
      averagePricePerSquareMeter: this.averagePricePerSquareMeter,
      propertyTypeDistribution: this.propertyTypeDistribution,
      priceRanges: this.priceRanges,
      trends: this.trends,
      marketSummary: this.getMarketSummary(),
      pricePerSquareMeterStats: this.getPricePerSquareMeterStats()
    };
  }
}

export { PropertyStatistics };