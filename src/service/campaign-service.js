const { sequelize } = require('../models');


const getPendingCampaignsCount = async () => {
  try {
    const [countCampaigns] = await sequelize.query(
      `SELECT COUNT(*) 
       FROM "Campaigns" 
       WHERE "isApproved" = 'PENDING';`
    );

  //  console.log('Pending campaigns count:', countCampaigns[0].count);
    return countCampaigns[0].count;
  } catch (error) {
    console.error('Error fetching pending campaigns count:', error);
    throw error;
  }
};


const updateCampaignApprovalStatus = async (campaignId, status, remark = null) => {
  try {
    if (!['APPROVE', 'REJECT'].includes(status)) {
      throw new Error('Invalid status. Must be APPROVE or REJECT.');
    }

    const finalStatus = status === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    // Update campaign
    await sequelize.query(
      `
        UPDATE "Campaigns"
        SET "isApproved" = :status,
            "remark" = :remark
        WHERE "id" = :campaignId
      `,
      {
        replacements: {
          status: finalStatus,
          remark: finalStatus === 'REJECTED' ? remark : null,
          campaignId
        },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    console.log(`Campaign ID ${campaignId} marked as ${finalStatus}`);
    return { message: `Campaign updated to ${finalStatus}` };

  } catch (error) {
    console.error('Error updating campaign status:', error);
    throw error;
  }
};


const getAllCampaigns = async () => {
  try {
    const [campaigns] = await sequelize.query(`
      SELECT * FROM "Campaigns";
    `);

    return campaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};


  const getCampaignByid = async (campaignId) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        c.*,
        p.product_type,
        d."deviceType",
        l."city"
      FROM "Campaigns" c
      LEFT JOIN "Products" p ON c."productId" = p."id"
      LEFT JOIN "CampaignDeviceTypes" cdt ON c."id" = cdt."campaignId"
      LEFT JOIN "Devices" d ON cdt."deviceTypeId" = d."id"
      LEFT JOIN "CampaignLocations" cl ON c."id" = cl."campaignId"
      LEFT JOIN "Locations" l ON cl."locationId" = l."id"
      WHERE c."id" = :campaignId;
    `, {
      replacements: { campaignId },
      type: sequelize.QueryTypes.SELECT
    });

    console.log("Fetched campaign details:", results);
    return results;
  } catch (error) {
    console.error("Error fetching full campaign details:", error);
    throw error;
  }
};


module.exports = {
  getPendingCampaignsCount,updateCampaignApprovalStatus,getAllCampaigns,getCampaignByid
};
