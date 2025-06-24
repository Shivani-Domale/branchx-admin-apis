const express = require('express');
const { CampaignController } = require('../../controllers');
const validate = require('../../validator/validate');
const campaignSchemas = require('../../validator/campaign-schemas');

const router = express.Router();

router.get('/pedingCampaignsCount', CampaignController.getCountPendingCampaigns);

router.put(
  '/:campaignId/campaignApproval',
  validate(campaignSchemas.campaignIdParam, 'params'),
  validate(campaignSchemas.campaignApproval),
  CampaignController.approveOrRejectCampaign
);

router.get('/getAllCampaigns', CampaignController.fetchCampaigns);

router.get(
  '/:campaignId/getCampaign',
  validate(campaignSchemas.campaignIdParam, 'params'),
  CampaignController.getCampaignDetailsById
);

module.exports = router;
