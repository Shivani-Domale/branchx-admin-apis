const { Device } = require('../models');

exports.create = async (data) => {
  return await Device.create(data);
};
