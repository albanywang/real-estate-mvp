// models/Property.js
/**
 * Property Model - Represents a real estate property with validation and business logic
 */
class Property {
  constructor(data = {}) {
    // Core identification
    this.id = data.id || null;
    
    // Basic property information
    this.title = data.title || '';
    this.price = data.price || 0;
    this.pricePerSquareMeter = data.pricePerSquareMeter || 0;
    this.address = data.address || '';
    this.layout = data.layout || '';
    this.area = data.area || 0;
    this.floorInfo = data.floorInfo || '';
    this.structure = data.structure || '';
    
    // Financial information
    this.managementFee = data.managementFee || 0;
    this.repairReserveFund = data.repairReserveFund || 0;
    this.landLeaseFee = data.landLeaseFee || 0;
    this.rightFee = data.rightFee || 0;
    this.depositGuarantee = data.depositGuarantee || 0;
    this.maintenanceFees = data.maintenanceFees || 0;
    this.otherFees = data.otherFees || 0;
    
    // Property characteristics
    this.areaOfUse = data.areaOfUse || '';
    this.transportation = data.transportation || '';
    this.propertyType = data.propertyType || '';
    this.yearBuilt = data.yearBuilt || '';
    this.balconyArea = data.balconyArea || 0;
    this.totalUnits = data.totalUnits || 0;
    this.siteArea = data.siteArea || 0;
    
    // Features and amenities
    this.bicycleParking = data.bicycleParking || '';
    this.bikeStorage = data.bikeStorage || '';
    this.pets = data.pets || false;
    this.parking = data.parking || '';
    this.kitchen = data.kitchen || '';
    this.bathToilet = data.bathToilet || '';
    this.facilitiesServices = data.facilitiesServices || '';
    this.others = data.others || '';
    
    // Legal and administrative
    this.landRights = data.landRights || '';
    this.managementForm = data.managementForm || '';
    this.landLawNotification = data.landLawNotification || '';
    this.currentSituation = data.currentSituation || '';
    this.extraditionPossibleDate = data.extraditionPossibleDate || null;
    this.transactionMode = data.transactionMode || '';
    this.propertyNumber = data.propertyNumber || '';
    this.evaluationCertificate = data.evaluationCertificate || '';
    
    // Dates and scheduling
    this.informationReleaseDate = data.informationReleaseDate || null;
    this.nextScheduledUpdateDate = data.nextScheduledUpdateDate || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    
    // Additional information
    this.remarks = data.remarks || '';
    this.images = Array.isArray(data.images) ? data.images : [];
    
    // Location data
    this.location = data.location || null; // [latitude, longitude] or GeoJSON
    
    // Computed properties
    this._computedFields = {};
  }

  /**
   * Validate the property data
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  validate() {
    const errors = [];
    const warnings = [];

    // Required field validations
    if (!this.title || this.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }

    if (!this.price || this.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (!this.address || this.address.trim().length < 5) {
      errors.push('Address must be at least 5 characters long');
    }

    if (!this.area || this.area <= 0) {
      errors.push('Area must be greater than 0');
    }

    // Type validations
    if (this.price && (typeof this.price !== 'number' || this.price < 0)) {
      errors.push('Price must be a positive number');
    }

    if (this.area && (typeof this.area !== 'number' || this.area < 0)) {
      errors.push('Area must be a positive number');
    }

    if (this.balconyArea && (typeof this.balconyArea !== 'number' || this.balconyArea < 0)) {
      errors.push('Balcony area must be a positive number');
    }

    if (this.totalUnits && (typeof this.totalUnits !== 'number' || this.totalUnits < 1)) {
      errors.push('Total units must be a positive integer');
    }

    if (this.yearBuilt && this.yearBuilt.length > 0) {
      const year = parseInt(this.yearBuilt);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1800 || year > currentYear + 5) {
        errors.push(`Year built must be between 1800 and ${currentYear + 5}`);
      }
    }

    // Property type validation
    const validPropertyTypes = [
      'apartment', 'house', 'condo', 'townhouse', 'studio', 
      'penthouse', 'duplex', 'commercial', 'land', 'other'
    ];
    if (this.propertyType && !validPropertyTypes.includes(this.propertyType.toLowerCase())) {
      warnings.push(`Property type '${this.propertyType}' is not in standard list`);
    }

    // Location validation
    if (this.location) {
      if (Array.isArray(this.location)) {
        const [lat, lng] = this.location;
        if (typeof lat !== 'number' || typeof lng !== 'number') {
          errors.push('Location coordinates must be numbers');
        } else if (lat < -90 || lat > 90) {
          errors.push('Latitude must be between -90 and 90');
        } else if (lng < -180 || lng > 180) {
          errors.push('Longitude must be between -180 and 180');
        }
      }
    }

    // Financial validation warnings
    if (this.price && this.area && this.pricePerSquareMeter) {
      const calculatedPricePerSqm = this.price / this.area;
      const difference = Math.abs(calculatedPricePerSqm - this.pricePerSquareMeter);
      const tolerance = calculatedPricePerSqm * 0.05; // 5% tolerance
      
      if (difference > tolerance) {
        warnings.push('Price per square meter does not match calculated value');
      }
    }

    // Images validation
    if (this.images && !Array.isArray(this.images)) {
      errors.push('Images must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Calculate price per square meter
   * @returns {number} Price per square meter
   */
  calculatePricePerSquareMeter() {
    if (!this.price || !this.area || this.area === 0) {
      return 0;
    }
    return Math.round((this.price / this.area) * 100) / 100;
  }

  /**
   * Get total monthly costs
   * @returns {number} Total monthly costs
   */
  getTotalMonthlyCosts() {
    return (
      (this.managementFee || 0) +
      (this.maintenanceFees || 0) +
      (this.landLeaseFee || 0) +
      (this.otherFees || 0)
    );
  }

  /**
   * Get property age in years
   * @returns {number|null} Age in years or null if year built is not set
   */
  getPropertyAge() {
    if (!this.yearBuilt) return null;
    const year = parseInt(this.yearBuilt);
    if (isNaN(year)) return null;
    return new Date().getFullYear() - year;
  }

  /**
   * Check if property allows pets
   * @returns {boolean} True if pets are allowed
   */
  allowsPets() {
    return Boolean(this.pets);
  }

  /**
   * Get property summary for listings
   * @returns {Object} Summary object
   */
  getSummary() {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      pricePerSquareMeter: this.calculatePricePerSquareMeter(),
      address: this.address,
      layout: this.layout,
      area: this.area,
      propertyType: this.propertyType,
      yearBuilt: this.yearBuilt,
      pets: this.allowsPets(),
      images: this.images.slice(0, 3), // First 3 images for summary
      location: this.location
    };
  }

  /**
   * Convert to JSON representation
   * @returns {Object} JSON object
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      pricePerSquareMeter: this.pricePerSquareMeter,
      address: this.address,
      layout: this.layout,
      area: this.area,
      floorInfo: this.floorInfo,
      structure: this.structure,
      managementFee: this.managementFee,
      areaOfUse: this.areaOfUse,
      transportation: this.transportation,
      propertyType: this.propertyType,
      yearBuilt: this.yearBuilt,
      balconyArea: this.balconyArea,
      totalUnits: this.totalUnits,
      repairReserveFund: this.repairReserveFund,
      landLeaseFee: this.landLeaseFee,
      rightFee: this.rightFee,
      depositGuarantee: this.depositGuarantee,
      maintenanceFees: this.maintenanceFees,
      otherFees: this.otherFees,
      bicycleParking: this.bicycleParking,
      bikeStorage: this.bikeStorage,
      siteArea: this.siteArea,
      pets: this.pets,
      landRights: this.landRights,
      managementForm: this.managementForm,
      landLawNotification: this.landLawNotification,
      currentSituation: this.currentSituation,
      extraditionPossibleDate: this.extraditionPossibleDate,
      transactionMode: this.transactionMode,
      propertyNumber: this.propertyNumber,
      informationReleaseDate: this.informationReleaseDate,
      nextScheduledUpdateDate: this.nextScheduledUpdateDate,
      remarks: this.remarks,
      evaluationCertificate: this.evaluationCertificate,
      parking: this.parking,
      kitchen: this.kitchen,
      bathToilet: this.bathToilet,
      facilitiesServices: this.facilitiesServices,
      others: this.others,
      images: this.images,
      location: this.location,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      
      // Computed fields
      calculatedPricePerSquareMeter: this.calculatePricePerSquareMeter(),
      totalMonthlyCosts: this.getTotalMonthlyCosts(),
      propertyAge: this.getPropertyAge(),
      allowsPets: this.allowsPets()
    };
  }

  /**
   * Create a Property instance from database row
   * @param {Object} dbRow - Database row object
   * @returns {Property} Property instance
   */
  static fromDatabaseRow(dbRow) {
    return new Property(dbRow);
  }

  /**
   * Create multiple Property instances from database rows
   * @param {Array} dbRows - Array of database row objects
   * @returns {Array<Property>} Array of Property instances
   */
  static fromDatabaseRows(dbRows) {
    return dbRows.map(row => Property.fromDatabaseRow(row));
  }
}

export { Property };