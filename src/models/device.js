// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Device extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//        Device.belongsTo(models.Location, { foreignKey: 'locationId' });
//          Device.belongsToMany(models.Campaign, {
//         through: 'CampaignDeviceTypes',
//         foreignKey: 'deviceTypeId'
//       });
//     }
//   }
//   Device.init({
//     deviceType: DataTypes.STRING,
//     price: DataTypes.INTEGER,
//     locationId: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'Device',
//   });
//   return Device;
// };

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Device extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//        Device.belongsTo(models.Location, { foreignKey: 'locationId' });
//          Device.belongsToMany(models.Campaign, {
//         through: 'CampaignDeviceTypes',
//         foreignKey: 'deviceTypeId'
//       });
//     }
//   }
//   Device.init({
//     deviceType: DataTypes.STRING,
//     price: DataTypes.INTEGER,
//     locationId: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'Device',
//   });
//   return Device;
// };

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
