
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
      Device.belongsTo(models.Location, { foreignKey: 'locationId' });
      Device.belongsToMany(models.Campaign, {
        through: 'CampaignDeviceTypes',
        foreignKey: 'deviceTypeId'
      });
    }
  }

  Device.init({
    deviceName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resolutionHeight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    resolutionWidth: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orientation: {
      type: DataTypes.ENUM('Horizontal', 'Vertical'),
      allowNull: false
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Device',
  });

  return Device;
};
