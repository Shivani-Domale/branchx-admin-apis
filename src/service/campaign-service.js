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

    await campaignRepository.updateApprovalStatus(campaignId, finalStatus, remark);

    return { message: `Campaign updated to ${finalStatus}` };
  } catch (error) {
    throw new Error(`Failed to update campaign: ${error.message}`);
  }
};

const getAllCampaigns = async () => {
  try {
    return await campaignRepository.findAll();
  } catch (error) {
    throw new Error(`Failed to fetch campaigns: ${error.message}`);
  }
};

const getCampaignByid = async (campaignId) => {
  try {
    const campaign = await campaignRepository.findById(campaignId);
    return campaign;
  } catch (error) {
    throw new Error(`Failed to fetch campaign: ${error.message}`);
  }
};


module.exports = {
  getPendingCampaignsCount,
  updateCampaignApprovalStatus,
  getAllCampaigns,
  getCampaignByid
};
