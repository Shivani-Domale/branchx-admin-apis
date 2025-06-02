const express = require('express');
const { CampaignController } = require('../../controllers');

const router = express.Router();


router.get('/pedingCampaignsCount',CampaignController.getCountPendingCampaigns);
router.put('/:campaignId/campaignApproval', CampaignController.approveOrRejectCampaign);

module.exports = router;

