const { Campaign, Location, Device } = require('../models');
const crudRepository = require('./crud-repository');
const { Op } = require("sequelize");

class CampaignRepository extends crudRepository {
  constructor() {
    super(Campaign);
  }

  async findByIdWithLocationAndDevice(campaignId) {
    return await Campaign.findOne({
      where: { id: campaignId },
      include: [
        {
          model: Location,
          through: { attributes: [] },
        },
        {
          model: Device,
          through: { attributes: [] },
        }
      ]
    });
  }

  async countByApprovalStatus(status) {
    return await Campaign.count({
      where: {
        isApproved: status
      }
    });
  }

  async updateApprovalStatus(campaignId, status, remark = null) {
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    campaign.isApproved = status;
    campaign.remark = status === 'REJECTED' ? remark : null;

    return await campaign.save();
  }

  async findByUserId(userId) {
    return await Campaign.findAll({
      where: { userId }
    });
  }
}

module.exports = CampaignRepository;