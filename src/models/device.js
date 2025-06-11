'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Device.belongsTo(models.Location, { foreignKey: 'locationId' });

    }
  }
  Device.init({
    deviceType: DataTypes.STRING,
    price: DataTypes.INTEGER,
    deviceCount: DataTypes.INTEGER,
    availableCount: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};