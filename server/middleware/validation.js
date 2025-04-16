/**
 * Middleware to validate request data
 */
module.exports = {
    /**
     * Validate request body against a schema
     * @param {Object} schema - Joi schema to validate against
     */
    validateBody: (schema) => {
      return (req, res, next) => {
        const { error } = schema.validate(req.body);
        
        if (error) {
          return res.status(400).json({ 
            message: 'Validation failed',
            details: error.details.map(detail => detail.message)
          });
        }
        
        next();
      };
    },
  
    /**
     * Validate request query params against a schema
     * @param {Object} schema - Joi schema to validate against
     */
    validateQuery: (schema) => {
      return (req, res, next) => {
        const { error } = schema.validate(req.query);
        
        if (error) {
          return res.status(400).json({ 
            message: 'Validation failed',
            details: error.details.map(detail => detail.message)
          });
        }
        
        next();
      };
    },
  
    /**
     * Validate request params against a schema
     * @param {Object} schema - Joi schema to validate against
     */
    validateParams: (schema) => {
      return (req, res, next) => {
        const { error } = schema.validate(req.params);
        
        if (error) {
          return res.status(400).json({ 
            message: 'Validation failed',
            details: error.details.map(detail => detail.message)
          });
        }
        
        next();
      };
    }
  };