const Joi = require('joi');

/**
 * Validate request data using Joi schema.
 * @param {Joi.Schema} schema - Joi schema
 * @param {string} [property='body'] - Request property: 'body', 'params', 'query'
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const options = {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    };

    const { error, value } = schema.validate(req[property], options);

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map((e) => e.message),
      });
    }

    req[property] = value; // sanitized and validated
    next();
  };
};

module.exports = validate;
