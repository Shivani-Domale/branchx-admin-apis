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

// Utility function to convert any string to 'Title Case' (e.g., 'mumbai' => 'Mumbai')
const toTitleCase = (str) => {
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

exports.createDevice = async (data) => {
  console.log(data);
  
  const requiredFields = ['deviceType', 'price', 'deviceCount', 'availableCount', 'location'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  }

  // Normalize location format (Title Case)
  const formattedLocation = toTitleCase(data.location.trim());

  // Find location by city name (formatted)
  const locationRecord = await Location.findOne({ where: { city: formattedLocation } });

  if (!locationRecord) {
    throw new Error(`Location "${formattedLocation}" not found`);
  }

  // Attach locationId to data
  data.locationId = locationRecord.id;

  // Clean up
  delete data.location;

  return await deviceRepository.create(data);
};

exports.isDeviceExists = async (deviceType, deviceName) => {
  const device = await Device.findOne({
    where: { deviceType }
  });
  return !!device;
};
