
const { sequelize } = require('../models');
const deviceRepository = require('../repositories/device-repository');

const validOrientations = ['Horizontal', 'Vertical'];
const defaultPrices = {
  'Cube': 10,
  'Cube Pro': 20,
  'Billboard': 10,
  'Mobile': 20,
  'pos': 10,
  'tv': 10,
  'ipad': 10,
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

  

    // Validate orientation
    const cleanOrientation = orientation?.trim();
    if (!validOrientations.includes(cleanOrientation)) {
      const error = new Error(`Invalid orientation. Allowed values are: ${validOrientations.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    // Check if device with same name and location already exists
    const deviceExists = await deviceRepository.isDeviceExists(formattedDeviceName, 1);
    if (deviceExists) {
      const error = new Error(`${formattedDeviceName} already exists in ${formattedCity}`);
      error.statusCode = 400;
      throw error;
    }

    const defaultPrices = defaultPrices[formattedDeviceName] || 10; // Default price if not found

    // Create device
    const newDevice = await deviceRepository.create({
      deviceName: formattedDeviceName,
      resolutionHeight: parseInt(resolutionHeight),
      resolutionWidth: parseInt(resolutionWidth),
      orientation: cleanOrientation,
      locationId: 1,
      price:defaultPrices // Add the price here
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
