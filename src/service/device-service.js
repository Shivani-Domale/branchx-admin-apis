
const { sequelize } = require('../models');
const deviceRepository = require('../repositories/device-repository');

const validOrientations = ['Horizontal', 'Vertical'];
const defaultPrices = {
  'Cube': 40,
  'Cube Pro': 50,
  'Billboard': 60,
  'Mobile': 30,
};

exports.createDevice = async (data) => {
  try {
    const {
      deviceName,
      resolutionHeight,
      resolutionWidth,
      orientation,
      locationName
    } = data;

    // Normalize and validate device name
    const cleanDeviceName = deviceName?.trim();
    const formattedDeviceName = cleanDeviceName?.toLowerCase()?.replace(/\b\w/g, (c) => c.toUpperCase());

  data.price = 30;

    // Validate orientation
    const cleanOrientation = orientation?.trim();
    if (!validOrientations.includes(cleanOrientation)) {
      const error = new Error(`Invalid orientation. Allowed values are: ${validOrientations.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    // Format city
    // const formattedCity = locationName?.trim()?.toLowerCase()?.replace(/\b\w/g, (c) => c.toUpperCase());
    // if (!formattedCity) {
    //   const error = new Error('Location name is required');
    //   error.statusCode = 400;
    //   throw error;
    // }

    // Get location by city
    // const location = await deviceRepository.getLocationByCity(formattedCity);
    // if (!location) {
    //   const error = new Error(`Location "${formattedCity}" not found`);
    //   error.statusCode = 404;
    //   throw error;
    // }

    // Check if device with same name and location already exists
    const deviceExists = await deviceRepository.isDeviceExists(formattedDeviceName, 1);
    if (deviceExists) {
      const error = new Error(`${formattedDeviceName} already exists in ${formattedCity}`);
      error.statusCode = 400;
      throw error;
    }

    // Get default price
    const price = defaultPrices[formattedDeviceName];

    // Create device
    const newDevice = await deviceRepository.create({
      deviceName: formattedDeviceName,
      resolutionHeight: parseInt(resolutionHeight),
      resolutionWidth: parseInt(resolutionWidth),
      orientation: cleanOrientation,
      locationId: 1,
      price, // Add the price here
    });

    return newDevice;
  } catch (error) {
    console.error(`Error in createDevice: ${error?.message}`);
    throw error;
  }
};


exports.getAllDevices = async () => {
  try {
    return await deviceRepository.findAll();
  } catch (error) {
    console.error(`Error in getAllDevices: ${error?.message}`);
    throw error;
  }
};

exports.toggleDeviceStatus = async (id) => {
  try {
    const device = await deviceRepository.findById(id);

    if (!device?.status) {
      throw new Error('Device not found or status is missing');
    }

    const newStatus = device.status === 'enabled' ? 'disabled' : 'enabled';
    await deviceRepository.updateStatus(id, newStatus);

    return {
      id,
      oldStatus: device.status,
      newStatus,
    };
  } catch (error) {
    console.error('Error in toggleDeviceStatus:', error);
    throw error;
  }
};

exports.getAllLocations = async () => {
  const locations = await sequelize.query(`
    SELECT DISTINCT city FROM "Locations"
  `, {
    type: sequelize.QueryTypes.SELECT,
  });

  // Format each location into { locationNames: "city name" }
  return locations.map(loc => ({ locationNames: loc.city }));
};
