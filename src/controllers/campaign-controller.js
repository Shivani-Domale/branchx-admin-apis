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

// const approveOrRejectCampaign = async (req, res) => {
//   const { campaignId } = req.params;
//   const { isApproved } = req.body; // Should be "APPROVED" or "REJECTED"

//   try {
//     const result = await CampaignService.updateCampaignApprovalStatus(campaignId, isApproved);
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const approveOrRejectCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const { isApproved, remark } = req.body; // isApproved: "APPROVE" or "REJECT"

  try {
    const result = await CampaignService.updateCampaignApprovalStatus(
      campaignId,
      isApproved,
      remark // optional message
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const fetchCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignService.getAllCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCampaignDetailsById = async (req, res) => {  

  const { campaignId } = req.params;
  try{
     const campaign  = await CampaignService.getCampaignByid(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' }); 
    }
    res.status(200).json(
      {
        campaign: campaign
      }
    );
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
    getCountPendingCampaigns,approveOrRejectCampaign,fetchCampaigns,getCampaignDetailsById
};