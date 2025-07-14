const express = require('express');
const { CampaignController } = require('../../controllers');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Campaign
 *   description: Admin-level campaign approval & management APIs
 */

/**
 * @swagger
 * /campaigns/pedingCampaignsCount:
 *   get:
 *     summary: Get count of pending campaigns
 *     tags: [Campaign]
 *     responses:
 *       200:
 *         description: Count of pending campaigns
 */
router.get('/pedingCampaignsCount', CampaignController.getCountPendingCampaigns);

/**
 * @swagger
 * /admin/campaigns/{campaignId}/campaignApproval:
 *   put:
 *     summary: Approve or reject a campaign
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the campaign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isApproved:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *                 example: APPROVED
 *               remark:
 *                 type: string
 *                 example: Meets quality standards
 *     responses:
 *       200:
 *         description: Campaign status updated
 */
router.put('/:campaignId/campaignApproval', CampaignController.approveOrRejectCampaign);

/**
 * @swagger
 * /campaigns/getAllCampaigns:
 *   get:
 *     summary: Get all campaigns (admin view)
 *     tags: [Campaign]
 *     responses:
 *       200:
 *         description: List of all campaigns
 */
router.get('/getAllCampaigns', CampaignController.fetchCampaigns);

/**
 * @swagger
 * /campaigns/{campaignId}/getCampaign:
 *   get:
 *     summary: Get campaign details by ID
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the campaign
 *     responses:
 *       200:
 *         description: Campaign details
 */
router.get('/:campaignId/getCampaign', CampaignController.getCampaignDetailsById);

module.exports = router;
