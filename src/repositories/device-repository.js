
const { sequelize } = require('../models');

exports.getLocationByCity = async (city) => {
  const [result] = await sequelize.query(
    `SELECT * FROM "Locations" WHERE city = :city LIMIT 1`,
    {
      replacements: { city },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return result || null;
};

exports.isDeviceExists = async (deviceType, locationId) => {
  const [result] = await sequelize.query(
    `SELECT id FROM "Devices" WHERE "deviceType" = :deviceType AND "locationId" = :locationId LIMIT 1`,
    {
      replacements: { deviceType, locationId },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return !!result;
};

exports.create = async (data) => {
  const [result] = await sequelize.query(
    `INSERT INTO "Devices" ("deviceType", "price", "locationId", "createdAt", "updatedAt")
     VALUES (:deviceType, :price, :locationId, NOW(), NOW())
     RETURNING *`,
    {
      replacements: {
        deviceType: data.deviceType,
        price: data.price,
        locationId: data.locationId,
      },
      type: sequelize.QueryTypes.INSERT,
    }
  );
  return result[0];
};
