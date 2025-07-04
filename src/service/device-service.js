
const deviceRepository = require('../repositories/device-repository');

const validOrientations = ['Horizontal', 'Vertical'];

exports.createDevice = async (data) => {
  try {
    const {
      deviceName,
      resolutionHeight,
      resolutionWidth,
      orientation,
      locationName
    } = data;

    // Validate orientation
    const cleanOrientation = orientation?.trim();
    if (!validOrientations.includes(cleanOrientation)) {
      const error = new Error(`Invalid orientation. Allowed values are: ${validOrientations.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    // Format city
    const formattedCity = locationName?.trim()?.toLowerCase()?.replace(/\b\w/g, (c) => c.toUpperCase());
    if (!formattedCity) {
      const error = new Error('Location name is required');
      error.statusCode = 400;
      throw error;
    }

    // Get location by city
    const location = await deviceRepository.getLocationByCity(formattedCity);
    if (!location) {
      const error = new Error(`Location "${formattedCity}" not found`);
      error.statusCode = 404;
      throw error;
    }

    // Check if device with same name and location already exists
    const deviceExists = await deviceRepository.isDeviceExists(deviceName, location?.id);
    if (deviceExists) {
      const error = new Error(`${deviceName} already exists in ${formattedCity}`);
      error.statusCode = 400;
      throw error;
    }

    // Create device
    const newDevice = await deviceRepository.create({
      deviceName: deviceName?.trim(),
      resolutionHeight: parseInt(resolutionHeight),
      resolutionWidth: parseInt(resolutionWidth),
      orientation: cleanOrientation,
      locationId: location?.id,
    });

    return newDevice;
  } catch (error) {
    console.error(`Error in createDevice: ${error?.message}`);
    throw error;
  }
};
