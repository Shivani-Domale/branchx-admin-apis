const Joi = require('joi');

const campaignIdParam = Joi.object({
  campaignId: Joi.number().integer().positive().required()
});

const campaignApproval = Joi.object({
  isApproved: Joi.string().valid('APPROVE', 'REJECT').required(),
  remark: Joi.string().allow('', null).optional()
});

module.exports = {
  campaignIdParam,
  campaignApproval
};
