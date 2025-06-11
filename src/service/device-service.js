//     const deviceRepository = require('../repositories/device-repository');
// const { Location } = require('../models');
// const { Device } = require('../models');

// exports.createDevice = async (data) => {
//   const requiredFields = ['deviceType', 'price', 'deviceCount', 'availableCount', 'locationId'];
//   for (const field of requiredFields) {
//     if (!data[field]) {
//       throw new Error(`${field} is required`);
//     }
//   }

//   const locationExists = await Location.findByPk(data.locationId);
//   if (!locationExists) {
//     throw new Error(`Location with ID ${data.locationId} does not exist`);
//   }

//   return await deviceRepository.create(data);
// };

// exports.isDeviceExists = async (deviceType, deviceName) => {
//   const device = await Device.findOne({
//     where: { deviceType}
//   });
//   return !!device;
// };


const deviceRepository = require('../repositories/device-repository');
const { Location, Device } = require('../models');

exports.createDevice = async (data) => {
  const requiredFields = ['deviceType', 'price', 'deviceCount', 'availableCount', 'location'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  }

  // Find location by name (from frontend)
  const locationRecord = await Location.findOne({ where: { city: data.location } });

  if (!locationRecord) {
    throw new Error(`Location "${data.location}" not found`);
  }

  // Attach locationId to data
  data.locationId = locationRecord.id;

  // Remove 'location' string to avoid issues
  delete data.location;

  return await deviceRepository.create(data);
};

exports.isDeviceExists = async (deviceType, deviceName) => {
  const device = await Device.findOne({
    where: { deviceType }
  });
  return !!device;
};
