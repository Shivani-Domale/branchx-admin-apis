const { sequelize } = require('../models');
const deviceRepository = require('../repositories/device-repository');
const locationRepository = require('../repositories/location-repository');

const validOrientations = ['Horizontal', 'Vertical'];

// Valid device types and their default prices
const defaultPricesMap = {
  'Cube': 10,
  'Cube Pro': 20,
  'Billboard': 10,
  'Mobile': 20,
  'Pos': 10,
  'Tv': 10,
  'Ipad': 10,
};

// Convert to CamelCase
const toCamelCase = (text) =>
  text?.toLowerCase()?.replace(/\b\w/g, (char) => char.toUpperCase()) || '';

exports.createDevice = async (data) => {
  try {
    const {
      deviceName,
      resolutionHeight,
      resolutionWidth,
      orientation,
      locationName,
      price, // optional custom price
    } = data;

    //  Format and validate device name
    const formattedDeviceName = toCamelCase(deviceName?.trim());
    if (!defaultPricesMap[formattedDeviceName]) {
      throw new Error(`Invalid device type. Allowed types: ${Object.keys(defaultPricesMap).join(', ')}`);
    }

    //  Validate orientation
    const cleanOrientation = orientation?.trim();
    if (!validOrientations.includes(cleanOrientation)) {
      throw new Error(`Invalid orientation. Allowed values: ${validOrientations.join(', ')}`);
    }

    //  Get location ID from name
    const location = await locationRepository.findLocationByName(locationName?.trim());
    if (!location) {
      throw new Error(`Location '${locationName}' not found.`);
    }

    //  Check if device already exists at location
    const deviceExists = await deviceRepository.isDeviceExists(formattedDeviceName, location.id);
    if (deviceExists) {
      throw new Error(`${formattedDeviceName} already exists in ${locationName}`);
    }

    //  Use custom price if provided, else use default
    const finalPrice = price !== undefined ? parseFloat(price) : defaultPricesMap[formattedDeviceName];

    //  Create device
    const newDevice = await deviceRepository.create({
      deviceName: formattedDeviceName,
      resolutionHeight: parseInt(resolutionHeight),
      resolutionWidth: parseInt(resolutionWidth),
      orientation: cleanOrientation,
      locationId: location.id,
      price: finalPrice,
    });

    return newDevice;

  } catch (error) {
    console.error(`Error in createDevice: ${error.message}`);
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
