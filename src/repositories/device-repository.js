
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
      price,
    } = data ?? {};

    const [result] = await sequelize.query(
      `INSERT INTO "Devices" 
        ("deviceName", "resolutionHeight", "resolutionWidth", "orientation", "locationId", "price", "createdAt", "updatedAt")
       VALUES 
        (:deviceName, :resolutionHeight, :resolutionWidth, :orientation, :locationId, :price, NOW(), NOW())
       RETURNING *`,
      {
        replacements: {
          deviceName,
          resolutionHeight,
          resolutionWidth,
          orientation,
          locationId,
          price,
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

exports.findAll = async () => {
  try {
    const [results] = await sequelize.query(`
      SELECT DISTINCT ON (d."deviceName") d.*, l.city AS "locationCity"
      FROM "Devices" d
      LEFT JOIN "Locations" l ON d."locationId" = l."id"
      ORDER BY d."deviceName", d."createdAt" DESC
    `);
    return results;
  } catch (error) {
    console.error(`Error in findAll: ${error?.message}`);
    throw error;
  }
};

exports.findById = async (id) => {
  try {
    const [device] = await sequelize.query(
      'SELECT * FROM "Devices" WHERE id = :id LIMIT 1',
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return device;
  } catch (error) {
    console.error('Error in findById:', error);
    throw new Error('Database error while fetching device');
  }
};

exports.updateStatus = async (id, newStatus) => {
  try {
    await sequelize.query(
      'UPDATE "Devices" SET status = :status WHERE id = :id',
      {
        replacements: { status: newStatus, id },
      }
    );
  } catch (error) {
    console.error('Error in updateStatus:', error);
    throw new Error('Database error while updating status');
  }
};
