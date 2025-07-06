
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
    console.log("---------------------------");
    
    if (!["APPROVE", "REJECT"].includes(status)) {
      throw new Error("Status must be either APPROVE or REJECT");
    }

    const finalStatus = status === "APPROVE" ? "APPROVED" : "REJECTED";
    const remark = " ";
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
    const campaigns = await sequelize.query(`
      SELECT c.*, p.product_type AS "productType"
      FROM "Campaigns" c
      LEFT JOIN "Products" p ON c."productId" = p.id
      WHERE c."isDeleted" = false
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    for (const campaign of campaigns) {
      // Fetch regions
      const locations = await sequelize.query(`
        SELECT l.city
        FROM "Locations" l
        INNER JOIN "CampaignLocations" cl ON cl."id" = l.id
        WHERE cl."campaignId" = :campaignId
      `, {
        replacements: { campaignId: campaign.id },
        type: sequelize.QueryTypes.SELECT
      });

      // Fetch devices
      const devices = await sequelize.query(`
        SELECT d."deviceName"
        FROM "Devices" d
        INNER JOIN "CampaignDeviceTypes" cdt ON cdt."deviceTypeId" = d.id
        WHERE cdt."campaignId" = :campaignId
      `, {
        replacements: { campaignId: campaign.id },
        type: sequelize.QueryTypes.SELECT
      });

      campaign.regions = locations;
      campaign.targetDevices = devices;

      // Parse productFiles and extract only first image
      let files = [];
      try {
        if (typeof campaign.productFiles === 'string') {
          files = JSON.parse(campaign.productFiles);
        } else if (Array.isArray(campaign.productFiles)) {
          files = campaign.productFiles;
        }
      } catch (err) {
        files = [];
      }

      // ✅ Only get first image (ignore video)
      const imageFile = files.find(file =>
        typeof file === 'string' &&
        (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.webp'))
      );

      campaign.image = imageFile || null;

      // ❌ Remove productFiles from final response
      delete campaign.productFiles;
    }

    return campaigns;
  } catch (error) {
    throw new Error(`Failed to fetch campaigns: ${error.message}`);
  }
};

const getCampaignById = async (campaignId) => {
  try {
    // Step 1: Fetch campaign by ID + join productType
    const [campaign] = await sequelize.query(`
      SELECT c.*, p.product_type AS "productType"
      FROM "Campaigns" c
      LEFT JOIN "Products" p ON c."productId" = p.id
      WHERE c.id = :campaignId
    `, {
      replacements: { campaignId },
      type: sequelize.QueryTypes.SELECT
    });

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Step 2: Fetch associated regions (locations)
    const locations = await sequelize.query(`
      SELECT l.city
      FROM "Locations" l
      INNER JOIN "CampaignLocations" cl ON cl."locationId" = l.id
      WHERE cl."campaignId" = :campaignId
    `, {
      replacements: { campaignId },
      type: sequelize.QueryTypes.SELECT
    });

    // Step 3: Fetch associated devices
    const devices = await sequelize.query(`
      SELECT d."deviceName"
      FROM "Devices" d
      INNER JOIN "CampaignDeviceTypes" cdt ON cdt."deviceTypeId" = d.id
      WHERE cdt."campaignId" = :campaignId
    `, {
      replacements: { campaignId },
      type: sequelize.QueryTypes.SELECT
    });

    // Step 4: Add extra fields
    campaign.regions = locations.map(loc => loc.city);
    campaign.targetDevices = devices.map(dev => dev.deviceName);

    return campaign;

  } catch (error) {
    throw new Error(`Failed to fetch campaign: ${error.message}`);
  }
};




module.exports = {

  getPendingCampaignsCount, updateCampaignApprovalStatus, getAllCampaigns, getCampaignById

};
