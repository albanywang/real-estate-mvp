// models/PropertyFactory.js
/**
 * Factory for creating Property instances from various sources
 */
import { Property } from "./Property.js";

class PropertyFactory {
  /**
   * Create Property from form data (for API endpoints)
   * @param {Object} formData - Form data from request
   * @param {Array} uploadedImages - Uploaded image files
   * @returns {Property} Property instance
   */
  static fromFormData(formData, uploadedImages = []) {
    // Process uploaded images to URLs
    const imageUrls = uploadedImages.map(file => `/images/${file.filename}`);

    // Handle location data
    let location = null;
    if (formData.lat && formData.lng) {
      const latitude = parseFloat(formData.lat);
      const longitude = parseFloat(formData.lng);
      
      if (!isNaN(latitude) && !isNaN(longitude)) {
        location = [latitude, longitude];
      }
    }

    // Convert string numbers to actual numbers
    const processedData = {
      ...formData,
      price: formData.price ? parseInt(formData.price) : 0,
      pricePerSquareMeter: formData.pricePerSquareMeter ? parseFloat(formData.pricePerSquareMeter) : 0,
      area: formData.area ? parseFloat(formData.area) : 0,
      balconyArea: formData.balconyArea ? parseFloat(formData.balconyArea) : 0,
      siteArea: formData.siteArea ? parseFloat(formData.siteArea) : 0,
      managementFee: formData.managementFee ? parseInt(formData.managementFee) : 0,
      totalUnits: formData.totalUnits ? parseInt(formData.totalUnits) : 0,
      repairReserveFund: formData.repairReserveFund ? parseInt(formData.repairReserveFund) : 0,
      landLeaseFee: formData.landLeaseFee ? parseInt(formData.landLeaseFee) : 0,
      rightFee: formData.rightFee ? parseInt(formData.rightFee) : 0,
      depositGuarantee: formData.depositGuarantee ? parseInt(formData.depositGuarantee) : 0,
      maintenanceFees: formData.maintenanceFees ? parseInt(formData.maintenanceFees) : 0,
      otherFees: formData.otherFees ? parseInt(formData.otherFees) : 0,
      pets: formData.pets === 'true' || formData.pets === true,
      location,
      images: imageUrls
    };

    return new Property(processedData);
  }

  /**
   * Create Property from CSV row
   * @param {Object} csvRow - CSV row data
   * @param {Object} columnMapping - Mapping of CSV columns to Property fields
   * @returns {Property} Property instance
   */
  static fromCSVRow(csvRow, columnMapping = {}) {
    const defaultMapping = {
      'Title': 'title',
      'Price': 'price',
      'Address': 'address',
      'Layout': 'layout',
      'Area': 'area',
      'Property Type': 'propertyType',
      'Year Built': 'yearBuilt',
      'Pets Allowed': 'pets'
      // Add more mappings as needed
    };

    const mapping = { ...defaultMapping, ...columnMapping };
    const propertyData = {};

    Object.entries(mapping).forEach(([csvColumn, propertyField]) => {
      if (csvRow[csvColumn] !== undefined) {
        let value = csvRow[csvColumn];

        // Handle type conversions
        if (['price', 'area', 'balconyArea', 'siteArea'].includes(propertyField)) {
          value = parseFloat(value) || 0;
        } else if (['managementFee', 'totalUnits'].includes(propertyField)) {
          value = parseInt(value) || 0;
        } else if (propertyField === 'pets') {
          value = ['true', 'yes', '1', 'allowed'].includes(String(value).toLowerCase());
        }

        propertyData[propertyField] = value;
      }
    });

    return new Property(propertyData);
  }

  /**
   * Create minimal Property for listings
   * @param {Object} basicData - Basic property data
   * @returns {Property} Property instance with minimal data
   */
  static createListing(basicData) {
    const requiredFields = {
      title: basicData.title || 'Untitled Property',
      price: basicData.price || 0,
      address: basicData.address || '',
      area: basicData.area || 0,
      propertyType: basicData.propertyType || 'apartment',
      layout: basicData.layout || '',
      images: basicData.images || []
    };

    return new Property(requiredFields);
  }

  /**
   * Create Property from external API data 
   * @param {Object} apiData - Data from external property API
   * @param {string} apiSource - Source of the API ('suumo', 'homes', etc.)
   * @returns {Property} Property instance
   */
  static fromExternalAPI(apiData, apiSource) {
    let propertyData = {};

    switch (apiSource) {
      case 'suumo':
        propertyData = {
          title: apiData.name,
          price: apiData.price,
          address: apiData.address,
          layout: apiData.madori,
          area: apiData.menseki,
          propertyType: apiData.bukken_type,
          yearBuilt: apiData.kenchiku_nengetsu,
          transportation: apiData.kotsu,
          // Map other Suumo-specific fields
        };
        break;
      
      case 'homes':
        propertyData = {
          title: apiData.property_name,
          price: apiData.rent || apiData.sale_price,
          address: apiData.full_address,
          layout: apiData.room_layout,
          area: apiData.floor_area,
          // Map other Homes-specific fields
        };
        break;
      
      default:
        propertyData = apiData;
    }

    return new Property(propertyData);
  }
}

export { PropertyFactory };