const express = require('express');
const { CampaignController } = require('../../controllers');

const router = express.Router();


router.get('/pedingCampaignsCount',CampaignController.getCountPendingCampaigns);
router.put('/:campaignId/campaignApproval', CampaignController.approveOrRejectCampaign);
router.get('/getAllCampaigns', CampaignController.fetchCampaigns);
router.get('/:campaignId/getCampaign',CampaignController.getCampaignDetailsById);

module.exports = router;

