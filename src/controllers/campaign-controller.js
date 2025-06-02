const { CampaignService } = require("../service");



const getCountPendingCampaigns = async (req, res) => {
    const campaigs = await CampaignService.getPendingCampaignsCount();
    console.log('Pending campaigns count:', campaigs);
    
    if (campaigs === null || campaigs === undefined) {
        return res.status(404).json({
            success: false,
            message: "No pending campaigns found",
            pendingCounts: 0
        });
    }


    return res.status(200).json({    
            success: true,   
            pendingCounts: campaigs,
    });
};

const approveOrRejectCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const { isApproved } = req.body; // Should be "APPROVED" or "REJECTED"

  try {
    const result = await CampaignService.updateCampaignApprovalStatus(campaignId, isApproved);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    getCountPendingCampaigns,approveOrRejectCampaign
};