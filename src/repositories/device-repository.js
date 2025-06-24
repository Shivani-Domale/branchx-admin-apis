
const { Device, Location } = require('../models');
const crudRepository = require('./crud-repository');
const { Op } = require('sequelize');

class DeviceRepository extends crudRepository {
  constructor() {
    super(Device);
  }

  async isDeviceExists(deviceType, locationId) {
    const device = await Device.findOne({
      where: {
        deviceType,
        locationId
      }
    });
    return !!device;
  }

  async getLocationByCity(city) {
    return await Location.findOne({
      where: { city }
    });
  }

  async create(data) {
    return await super.create(data);
  }
}

module.exports = DeviceRepository;

//Previous code for reference

// const { sequelize } = require('../models');

// exports.getLocationByCity = async (city) => {
//   const [result] = await sequelize.query(
//     `SELECT * FROM "Locations" WHERE city = :city LIMIT 1`,
//     {
//       replacements: { city },
//       type: sequelize.QueryTypes.SELECT,
//     }
//   );
//   return result || null;
// };

// exports.isDeviceExists = async (deviceType, locationId) => {
//   const [result] = await sequelize.query(
//     `SELECT id FROM "Devices" WHERE "deviceType" = :deviceType AND "locationId" = :locationId LIMIT 1`,
//     {
//       replacements: { deviceType, locationId },
//       type: sequelize.QueryTypes.SELECT,
//     }
//   );
//   return !!result;
// };

// exports.create = async (data) => {
//   const [result] = await sequelize.query(
//     `INSERT INTO "Devices" ("deviceType", "price", "locationId", "createdAt", "updatedAt")
//      VALUES (:deviceType, :price, :locationId, NOW(), NOW())
//      RETURNING *`,
//     {
//       replacements: {
//         deviceType: data.deviceType,
//         price: data.price,
//         locationId: data.locationId,
//       },
//       type: sequelize.QueryTypes.INSERT,
//     }
//   );
//   return result[0];
// };
