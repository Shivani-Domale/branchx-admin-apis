const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map((e) => e.message),
      });
    }

    req.body = value; // sanitized and validated
    next();
  };
};

module.exports = validate;
