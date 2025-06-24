
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

    // Fetch all campaigns with productType from Product table
    const campaigns = await sequelize.query(`
      SELECT c.*, p.product_type AS "productType"
      FROM "Campaigns" c
      LEFT JOIN "Products" p ON c."productId" = p.id
      WHERE c."isDeleted" = false
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    //  Attach targetRegions and aDevices for each campaign
    for (const campaign of campaigns) {
      // Fetch targetRegions (Locations)
      const locations = await sequelize.query(`
        SELECT  l.city
        FROM "Locations" l
        INNER JOIN "CampaignLocations" cl ON cl."id" = l.id
        WHERE cl."campaignId" = :campaignId
      `, {
        replacements: { campaignId: campaign.id },
        type: sequelize.QueryTypes.SELECT
      });

      // Fetch aDevices (Devices)
      const devices = await sequelize.query(`
        SELECT d."deviceType"
        FROM "Devices" d
        INNER JOIN "CampaignDeviceTypes" cdt ON cdt."deviceTypeId" = d.id
        WHERE cdt."campaignId" = :campaignId
      `, {
        replacements: { campaignId: campaign.id },
        type: sequelize.QueryTypes.SELECT
      });

      campaign.targetRegions = locations;
      campaign.aDevices = devices;
    }


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
