const { sequelize } = require("../models");
const CampaignRepository = require("../repositories/campaign-repository");

const campaignRepository = new CampaignRepository();

const getPendingCampaignsCount = async () => {
  try {
    const count = await campaignRepository.countByApprovalStatus("PENDING");
    return count;
  } catch (error) {
    throw new Error(`Failed to count pending campaigns: ${error.message}`);
  }
};

const updateCampaignApprovalStatus = async (campaignId, status, remark) => {
  try {
    if (!["APPROVE", "REJECT"].includes(status)) {
      throw new Error("Status must be either APPROVE or REJECT");
    }

    const finalStatus = status === "APPROVE" ? "APPROVED" : "REJECTED";

    const [result] = await sequelize.query(`
      UPDATE "Campaigns"
      SET "isApproved" = :finalStatus,
          "remark" = :remark,
          "updatedAt" = NOW()
      WHERE "id" = :campaignId
    `, {
      replacements: { campaignId, finalStatus, remark },
      type: sequelize.QueryTypes.UPDATE
    });

    return { message: `Campaign updated to ${finalStatus}` };
  } catch (error) {
    throw new Error(`Failed to update campaign: ${error.message}`);
  }
};


const getAllCampaigns = async () => {
  try {
   const [campaigns] = await sequelize.query(
      `SELECT * FROM "Campaigns";
    `);

    return campaigns;
  } catch (error) {
    throw new Error(`Failed to fetch campaigns: ${error.message}`);
  }
};

const getCampaignByid = async (campaignId) => {
  try {
    const [campaigns] = await sequelize.query(
      `SELECT * FROM "Campaigns" WHERE id = :campaignId`, 
      {
        replacements: { campaignId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!campaigns) {
      throw new Error("Campaign not found");
    }

    return campaigns;
  } catch (error) {
    throw new Error(`Failed to fetch campaign: ${error.message}`);
  }
};



module.exports = {

  getPendingCampaignsCount, updateCampaignApprovalStatus, getAllCampaigns, getCampaignByid

};
