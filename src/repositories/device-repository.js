const { sequelize } = require('../models');

// Get location by city
exports.getLocationByCity = async (city) => {
  try {
    const [result] = await sequelize.query(
      `SELECT * FROM "Locations" WHERE city = :city LIMIT 1`,
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

// Check if device exists
exports.isDeviceExists = async (deviceType, locationId) => {
  try {
    const [result] = await sequelize.query(
      `SELECT id FROM "Devices" WHERE "deviceType" = :deviceType AND "locationId" = :locationId LIMIT 1`,
      {
        replacements: { deviceType, locationId },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return Boolean(result);
  } catch (error) {
    console.error(`Error in isDeviceExists: ${error?.message}`);
    throw error;
  }
};

// Create a new device
exports.create = async (data) => {
  try {
    const {
      deviceType,
      price,
      locationId,
    } = data ?? {};

    const [result] = await sequelize.query(
      `INSERT INTO "Devices" ("deviceType", "price", "locationId", "createdAt", "updatedAt")
       VALUES (:deviceType, :price, :locationId, NOW(), NOW())
       RETURNING *`,
      {
        replacements: {
          deviceType,
          price,
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
