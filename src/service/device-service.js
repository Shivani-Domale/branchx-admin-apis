const deviceRepository = require('../repositories/device-repository');

const validTypes = ['mobile', 'cube', 'cube pro', 'tv', 'billboard'];

const properCaseMap = {
  'mobile': 'Mobile',
  'cube': 'Cube',
  'cube pro': 'Cube Pro',
  'tv': 'TV',
  'billboard': 'Billboard',
};

exports.createDevice = async (data) => {
  try {
    const inputType = data?.deviceType?.trim()?.toLowerCase();

    if (!validTypes.includes(inputType)) {
      const error = new Error(`Invalid deviceType. Allowed types are: ${validTypes.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const deviceType = properCaseMap[inputType];

    const formattedCity = data?.locationName?.trim()?.toLowerCase()?.replace(/\b\w/g, (c) => c.toUpperCase());
    if (!formattedCity) {
      const error = new Error('Location name is required');
      error.statusCode = 400;
      throw error;
    }

    const location = await deviceRepository.getLocationByCity(formattedCity);
    if (!location) {
      const error = new Error(`Location "${formattedCity}" not found`);
      error.statusCode = 404;
      throw error;
    }

    const deviceExists = await deviceRepository.isDeviceExists(deviceType, location?.id);
    if (deviceExists) {
      const error = new Error(`${deviceType} already exists in ${formattedCity}`);
      error.statusCode = 400;
      throw error;
    }

    const newDevice = await deviceRepository.create({
      deviceType,
      price: data?.price,
      locationId: location?.id,
    });

    return newDevice;
  } catch (error) {
    console.error(`Error in createDevice: ${error?.message}`);
    throw error;
  }
};
