const Joi = require('joi');

const createDevice = Joi.object({
  deviceType: Joi.string().valid('MOBILE', 'CUBE PRO', 'CUBE', 'TV', 'BILLBOARD').required(),
  price: Joi.number().positive().required(),
  locationId: Joi.number().integer().positive().required()
});

module.exports = {
  createDevice
};
