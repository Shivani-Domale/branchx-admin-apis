
const { sequelize } = require('../models');

//  Get location by city
exports.getLocationByCity = async (city) => {
  try {
    const [result] = await sequelize.query(
      `SELECT * FROM "Locations" WHERE "city" = :city LIMIT 1`,
      {
        replacements: { city },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return result ?? null;
  } catch (error) {
    console.error(`Error in getLocationByCity: ${error?.message}`);
    throw error;
  }
};

//  Check if device exists by deviceName + locationId
exports.isDeviceExists = async (deviceName, locationId) => {
  try {
    const [result] = await sequelize.query(
      `SELECT id FROM "Devices" 
       WHERE "deviceName" = :deviceName AND "locationId" = :locationId
       LIMIT 1`,
      {
        replacements: { deviceName, locationId },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return Boolean(result);
  } catch (error) {
    console.error(`Error in isDeviceExists: ${error?.message}`);
    throw error;
  }
};

//  Create a new device
exports.create = async (data) => {
  try {
    const {
      deviceName,
      resolutionHeight,
      resolutionWidth,
      orientation,
      locationId,
    } = data ?? {};

    const [result] = await sequelize.query(
      `INSERT INTO "Devices" 
        ("deviceName", "resolutionHeight", "resolutionWidth", "orientation", "locationId", "createdAt", "updatedAt")
       VALUES 
        (:deviceName, :resolutionHeight, :resolutionWidth, :orientation, :locationId, NOW(), NOW())
       RETURNING *`,
      {
        replacements: {
          deviceName,
          resolutionHeight,
          resolutionWidth,
          orientation,
          locationId,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    return result?.[0] ?? null;
  } catch (error) {
    console.error(`Error in create: ${error?.message}`);
    throw error;
  }
};
