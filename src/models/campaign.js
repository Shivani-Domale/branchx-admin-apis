'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Campaign.belongsToMany(models.Device, {
        through: 'CampaignDeviceTypes',
        foreignKey: 'campaignId'
      });

      Campaign.belongsToMany(models.Location, {
        through: 'CampaignLocations',
        foreignKey: 'campaignId'
      });

      Campaign.belongsTo(models.Product, {
        foreignKey: 'productId'
      });
      
      Campaign.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user' // Optional alias
      });

    }
  }
  Campaign.init({
    campaignName: DataTypes.STRING,
    campaignCode: DataTypes.STRING,
    campaignDescription: DataTypes.STRING,
    campaignObjective: DataTypes.STRING,
    campaignType: DataTypes.STRING,
    creativeFile: DataTypes.STRING,
    creativeType: DataTypes.STRING,
    demographic: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    interval: DataTypes.INTEGER,
    maxBidCap: DataTypes.INTEGER,
    scheduleDate: DataTypes.STRING,
    scheduleEndDate: DataTypes.STRING,
    selectedDays: DataTypes.STRING,
    timeSlot: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    isApproved: DataTypes.STRING,
    isPayment: DataTypes.BOOLEAN,
    baseBid: DataTypes.INTEGER,
    budgetLimit: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    remark : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Campaign',
  });

  Campaign.addHook('beforeCreate', async (campaign, options) => {
    const brandPrefix = campaign.campaignName.slice(0, 3).toUpperCase();

    const lastCampaign = await Campaign.findOne({
      where: {
        campaignCode: {
          [sequelize.Sequelize.Op.like]: `${brandPrefix}%`
        }
      },
      order: [['createdAt', 'DESC']]
    });

    let nextNumber = '001';
    if (lastCampaign && lastCampaign.campaignCode) {
      const lastNumber = parseInt(lastCampaign.campaignCode.slice(3));
      nextNumber = String(lastNumber + 1).padStart(3, '0');
    }

    campaign.campaignCode = `${brandPrefix}${nextNumber}`;
  });

  return Campaign;
};