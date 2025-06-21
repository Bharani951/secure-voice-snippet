/**
 * Request validation middleware
 * Uses Joi for schema validation
 */
const Joi = require("joi");
const constants = require("../config/constants");

/**
 * Middleware factory to validate request data against a Joi schema
 * @param {Object} schema - Joi schema object with validate, body, query, params properties
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false, // Return all errors
    allowUnknown: true, // Ignore unknown props
    stripUnknown: false, // Keep unknown props
  };

  // Validate request body
  if (schema.body) {
    const { error, value } = schema.body.validate(req.body, validationOptions);

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: message,
      });
    }

    // Replace req.body with validated value
    req.body = value;
  }

  // Validate URL parameters
  if (schema.params) {
    const { error, value } = schema.params.validate(
      req.params,
      validationOptions
    );

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: message,
      });
    }

    // Replace req.params with validated value
    req.params = value;
  }

  // Validate query parameters
  if (schema.query) {
    const { error, value } = schema.query.validate(
      req.query,
      validationOptions
    );

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: message,
      });
    }

    // Replace req.query with validated value
    req.query = value;
  }

  // Validation passed
  next();
};

module.exports = validate;
