// models/PropertyValidators.js
/**
 * Custom validators for property data
 */
class PropertyValidators {
  /**
   * Validate Japanese postal code
   * @param {string} postalCode - Postal code to validate
   * @returns {boolean} True if valid
   */
  static validateJapanesePostalCode(postalCode) {
    if (!postalCode) return true; // Optional field
    const regex = /^\d{3}-\d{4}$/;
    return regex.test(postalCode);
  }

  /**
   * Validate property number format
   * @param {string} propertyNumber - Property number to validate
   * @returns {boolean} True if valid
   */
  static validatePropertyNumber(propertyNumber) {
    if (!propertyNumber) return true; // Optional field
    // Allow alphanumeric with hyphens and spaces
    const regex = /^[A-Za-z0-9\s\-]+$/;
    return regex.test(propertyNumber) && propertyNumber.length <= 50;
  }

  /**
   * Validate image URLs
   * @param {Array} images - Array of image URLs
   * @returns {Object} Validation result
   */
  static validateImages(images) {
    const errors = [];
    
    if (!Array.isArray(images)) {
      return { isValid: false, errors: ['Images must be an array'] };
    }

    if (images.length > 20) {
      errors.push('Maximum 20 images allowed');
    }

    images.forEach((image, index) => {
      if (typeof image !== 'string') {
        errors.push(`Image ${index + 1} must be a string URL`);
      } else if (!image.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        errors.push(`Image ${index + 1} must be a valid image file`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate price consistency
   * @param {Object} priceData - Object with price, area, pricePerSquareMeter
   * @returns {Object} Validation result
   */
  static validatePriceConsistency(priceData) {
    const { price, area, pricePerSquareMeter } = priceData;
    const warnings = [];

    if (price && area && pricePerSquareMeter) {
      const calculatedPrice = area * pricePerSquareMeter;
      const difference = Math.abs(price - calculatedPrice);
      const tolerance = price * 0.05; // 5% tolerance

      if (difference > tolerance) {
        warnings.push(`Price (¥${price.toLocaleString()}) doesn't match calculated value (¥${calculatedPrice.toLocaleString()}) based on area and price per sqm`);
      }
    }

    return {
      isValid: true,
      warnings
    };
  }

  /**
   * Validate date fields
   * @param {Object} dates - Object with date fields
   * @returns {Object} Validation result
   */
  static validateDates(dates) {
    const errors = [];
    const now = new Date();

    Object.entries(dates).forEach(([field, dateValue]) => {
      if (dateValue) {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
          errors.push(`${field} must be a valid date`);
        } else if (field === 'extraditionPossibleDate' && date < now) {
          errors.push(`${field} cannot be in the past`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
export { PropertyValidators };