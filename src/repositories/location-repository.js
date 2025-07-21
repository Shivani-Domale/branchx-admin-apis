const { Location } = require('../models'); // Assuming Location is a Sequelize model

class LocationRepository {
  async findLocationByName(name) {
    return await Location.findOne({ where: { city :name } });
  }
}

module.exports = new LocationRepository();
