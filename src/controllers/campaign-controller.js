const { CampaignService } = require("../service");

// Get count of pending campaigns - GET /campaigns/pending-count
const getCountPendingCampaigns = async (req, res) => {
  try {
    const count = await CampaignService.getPendingCampaignsCount();

    if (count === null || count === undefined) {
      return res.status(404).json({
        success: false,
        message: "No pending campaigns found",
        pendingCounts: 0,
      });
    }

    res.status(200).json({
      success: true,
      pendingCounts: count,
    });
  } catch (err) {
    res.status(500).json({ message: err?.message || "Something went wrong" });
  }
};

// Approve or Reject Campaign - PUT /campaigns/:campaignId/approval
const approveOrRejectCampaign = async (req, res) => {
  const campaignId = req.params?.campaignId;
  const isApproved = req.body?.isApproved;
  const remark = req.body?.remark;

  if (!campaignId || !isApproved) {
    return res.status(400).json({ message: "Campaign ID and approval status are required" });
  }

  try {
    const result = await CampaignService.updateCampaignApprovalStatus(
      campaignId,
      isApproved,
      remark
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err?.message || "Approval update failed" });
  }
};

// Get all campaigns - GET /campaigns
const fetchCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignService.getAllCampaigns();
    res.status(200).json({ data: campaigns });
  } catch (error) {
    res.status(500).json({ message: error?.message || "Failed to fetch campaigns" });
  }
};

// Get campaign details by ID - GET /campaigns/:campaignId
const getCampaignDetailsById = async (req, res) => {
  const campaignId = req.params?.campaignId;

  if (!campaignId) {
    return res.status(400).json({ message: "Campaign ID is required" });
  }

  try {
    const campaign = await CampaignService.getCampaignByid(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ campaign });
  } catch (error) {
    res.status(500).json({ message: error?.message || "Error fetching campaign" });
  }
};

module.exports = {
  getCountPendingCampaigns,
  approveOrRejectCampaign,
  fetchCampaigns,
  getCampaignDetailsById,
};
