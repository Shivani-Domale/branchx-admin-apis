// const deviceRepository = require('../repositories/device-repository');
// const { Location, Device } = require('../models');

// // Convert to title case (e.g., mumbai -> Mumbai)
// const toTitleCase = (str) => {
//   return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
// };

// const validTypes = ['mobile', 'cube', 'cube pro', 'tv'];

// exports.isDeviceExists = async (deviceType) => {
//   const device = await Device.findOne({ where: { deviceType } });
//   return !!device;
// };

// exports.createDevice = async (data) => {
//   // Normalize location name
//   const formattedLocation = toTitleCase(data.locationName.trim());

//   // Find location
//   const location = await Location.findOne({ where: { city: formattedLocation } });
//   if (!location) {
//     throw new Error(`Location "${formattedLocation}" not found`);
//   }

//   // Attach locationId
//   data.locationId = location.id;

//   // Set availableCount to deviceCount if not explicitly provided
//   if (data.availableCount === undefined) {
//     data.availableCount = data.deviceCount;
//   }

//   // Final cleanup
//   delete data.locationName;

//   return await deviceRepository.create(data);
// };


const deviceRepository = require('../repositories/device-repository');
const { Device, Location } = require('../models');

exports.getLocationByCity = async (cityName) => {
  return await Location.findOne({ where: { city: cityName } });
};

exports.isDeviceExists = async (deviceType, locationId) => {
  const device = await Device.findOne({
    where: {
      deviceType,
      locationId
    }
  });
  return !!device;
};

exports.createDevice = async (data) => {
  const requiredFields = ['deviceType', 'price', 'deviceCount', 'availableCount', 'locationId'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  }

  const locationExists = await Location.findByPk(data.locationId);
  if (!locationExists) {
    throw new Error(`Location with ID ${data.locationId} does not exist`);
  }

  return await deviceRepository.create(data);
};
