/**
 * Format error response
 * @param {Error} error - Error object
 * @returns {Object} Formatted error
 */
const formatError = (error) => {
    return {
      message: error.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  };
  
  /**
   * Format success response
   * @param {Object} data - Response data
   * @param {string} message - Success message
   * @returns {Object} Formatted response
   */
  const formatSuccess = (data, message = 'Operation successful') => {
    return {
      success: true,
      message,
      data
    };
  };
  
  /**
   * Generate pagination data
   * @param {number} total - Total items
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @returns {Object} Pagination data
   */
  const getPagination = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    
    return {
      total,
      totalPages,
      currentPage: page,
      perPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  };
  
  /**
   * Calculate pagination offset
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @returns {number} Offset
   */
  const getPaginationOffset = (page, limit) => {
    return (page - 1) * limit;
  };
  
  /**
   * Format address components
   * @param {Object} property - Property with address components
   * @returns {string} Formatted address
   */
  const formatAddress = (property) => {
    return `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`;
  };
  
  module.exports = {
    formatError,
    formatSuccess,
    getPagination,
    getPaginationOffset,
    formatAddress
  };