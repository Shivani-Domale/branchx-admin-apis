const { User } = require('../models');

exports.create = async (data) => {
  return await User.create(data);
};


exports.getAllUsers = async () => {
  return await User.findAll();
};

exports.findById = async (userId) => {
  return await User.findByPk(userId);
} 
