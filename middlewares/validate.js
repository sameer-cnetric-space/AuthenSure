/**
 * Generic middleware for validating request data
 * @param {Object} schema - Joi schema object to validate request data
 * @param {String} property - Request object property to validate (e.g., 'body', 'query', 'params')
 */
const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);

    if (error) {
      // Send error response if validation fails
      return res.status(400).json({
        message: "Validation error",
        details: error.details,
      });
    }

    // Proceed to the next middleware or route handler if validation passes
    next();
  };
};

module.exports = validate;
