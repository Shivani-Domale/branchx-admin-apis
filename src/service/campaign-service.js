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
    if (finalStatus === "APPROVED") {
      remark = " ";
    }
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
      AND c."isApproved" = 'APPROVED'
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

   //   campaign.regions = locations;
      campaign.targetDevices = devices;

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

      // Filter all image files
      const imageFiles = files.filter(file =>
        typeof file === 'string' &&
        (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.webp'))
      );

      // Filter all video files
      const videoFiles = files.filter(file =>
        typeof file === 'string' &&
        (file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi') || file.endsWith('.mkv'))
      );

      // Assign arrays to productFiles field
      campaign.productFiles = {
        images: imageFiles.length > 0 ? imageFiles : [],
        videos: videoFiles.length > 0 ? videoFiles : []
      };


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

// const getApprovedCampaignsByDevice = async (deviceName, location) => {
//   try {
//     const campaigns = await sequelize.query(`
//       SELECT DISTINCT c.id, c."campaignName", c."productFiles", p.product_type AS "productType"
//       FROM "Campaigns" c
//       LEFT JOIN "Products" p ON c."productId" = p.id
//       INNER JOIN "CampaignDeviceTypes" cdt ON cdt."campaignId" = c.id
//       INNER JOIN "Devices" d ON d.id = cdt."deviceTypeId"
//       INNER JOIN "CampaignLocations" cl ON cl."campaignId" = c.id
//       INNER JOIN "Locations" l ON l.id = cl."locationId"
//       WHERE 
//         c."isDeleted" = false 
//         AND c."isApproved" = 'APPROVED'
//         ${deviceName ? `AND d."deviceName" ILIKE :deviceName` : ''}
//         ${location ? `AND l."city" ILIKE :location` : ''}
//     `, {
//       replacements: {
//         deviceName: deviceName ? `%${deviceName}%` : undefined,
//         location: location ? `%${location}%` : undefined
//       },
//       type: sequelize.QueryTypes.SELECT
//     });

//     // Parse productFiles (JSON) if needed
//     return campaigns.map(campaign => {
//       try {
//         campaign.productFiles = typeof campaign.productFiles === 'string'
//           ? JSON.parse(campaign.productFiles)
//           : campaign.productFiles;
//       } catch (e) {
//         campaign.productFiles = [];
//       }
//       return campaign;
//     });

//   } catch (error) {
//     throw new Error('Failed to fetch approved campaigns: ' + error.message);
//   }
// };



// const getApprovedCampaignsByDevice = async (deviceName, location) => {
//     if (deviceName === 'Android') {
//       deviceName = 'Android';
//       location = 'Mumbai';
//     }


//     const response = await getAllCampaigns();

//     console.log("Response from getAllCampaigns:", response);
//   // try {
//   //   const query = `
//   //     SELECT DISTINCT 
//   //       c.id, 
//   //       c."campaignName", 
//   //       c."productFiles", 
//   //       p.product_type AS "productType"
//   //     FROM "Campaigns" c
//   //     LEFT JOIN "Products" p ON c."productId" = p.id
//   //     INNER JOIN "CampaignDeviceTypes" cdt ON cdt."campaignId" = c.id
//   //     INNER JOIN "Devices" d ON d.id = cdt."deviceTypeId"
//   //     INNER JOIN "CampaignLocations" cl ON cl."campaignId" = c.id
//   //     INNER JOIN "Locations" l ON l.id = cl."locationId"
//   //     WHERE 
//   //       c."isDeleted" = false 
//   //       AND c."isApproved" = 'APPROVED'
//   //     AND TRIM(d."deviceName") ILIKE :deviceName
//   //   AND TRIM(l."city") ILIKE :location
//   //   `;

//   //   const campaigns = await sequelize.query(query, {
//   //     replacements: {
//   //       deviceName: deviceName ? `%${deviceName}%` : undefined,
//   //       location: location ? `%${location}%` : undefined
//   //     },
//   //     type: sequelize.QueryTypes.SELECT
//   //   });

//   //   return campaigns;

//   // } catch (error) {
//   //   console.error('SQL Error:', error);
//   //   throw new Error('Failed to fetch approved campaigns: ' + error.message);
//   // }

//   return response;
// };

const getApprovedCampaignsByDevice = async (deviceName, location) => {

  const response = await getAllCampaigns();

  const filteredCampaigns = response.filter(campaign => {
    if (!campaign.targetDevices || !Array.isArray(campaign.targetDevices)) return false;

    return campaign.targetDevices.some(device => {
      return device.deviceName?.toLowerCase().trim() === deviceName.toLowerCase().trim();
    });
  });

  return filteredCampaigns;
};





module.exports = {
  getPendingCampaignsCount, updateCampaignApprovalStatus, getAllCampaigns, getCampaignById,
  getApprovedCampaignsByDevice
};
