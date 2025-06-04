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

const updateCampaignApprovalStatus = async (campaignId, status) => {
  try {

    if (!['APPROVE', 'REJECT'].includes(status)) {
      throw new Error('Invalid status. Must be APPROVED or REJECTED.');
    }
   if(status === 'APPROVE') 
    {
      status = 'APPROVED';
    }else{
      status = 'REJECTED';
    }

    await sequelize.query(
      `UPDATE "Campaigns"
       SET "isApproved" = :status
       WHERE "id" = :campaignId`,
      {
        replacements: {status , campaignId },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    console.log(`Campaign ID ${campaignId} marked as ${status}`);
    return { message: `Campaign updated to ${status}` };
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
    const [campaign] = await sequelize.query(`
      SELECT * FROM "Campaigns" WHERE "id" = :campaignId;
    `, {
      replacements: { campaignId },
      type: sequelize.QueryTypes.SELECT
    });

    return campaign;
  } catch (error) {
    console.error('Error fetching campaign by ID:', error);
    throw error;
  }
};

module.exports = {
  getPendingCampaignsCount,updateCampaignApprovalStatus,getAllCampaigns,getCampaignByid
};
