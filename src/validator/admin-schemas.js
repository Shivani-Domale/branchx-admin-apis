const Joi = require('joi');

exports.registerAdmin = Joi.object({
  name: Joi.string().min(3).max(50).trim().required(),
  email: Joi.string().email().trim().required(),
});

exports.loginAdmin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

exports.verifyResetCode = Joi.object({
  email: Joi.string().email().required(),
  resetToken: Joi.string().required(),
});

exports.resetPassword = Joi.object({
  email: Joi.string().email().required(),
  resetToken: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

exports.changePassword = Joi.object({
  email: Joi.string().email().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});
