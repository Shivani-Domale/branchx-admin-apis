'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Location.belongsToMany(models.Campaign, {
        through: 'CampaignLocations',
        foreignKey: 'locationId'
      });
    }
  }
  Location.init({
    city: DataTypes.STRING,
    tier: DataTypes.STRING,
    price: DataTypes.INTEGER,
    deviceCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};