const express = require('express');
const router = express.Router();
const deviceController = require('../../controllers/device-controller');

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Device management APIs (Admin only)
 */

/**
 * @swagger
 * /devices/admin/devices:
 *   post:
 *     summary: Create a new device
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceType
 *             properties:
 *               deviceType:
 *                 type: string
 *                 example: LED Board
 *               description:
 *                 type: string
 *                 example: Large outdoor screen
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Device created successfully
 */
router.post('/admin/devices', deviceController.createDevice);

/**
 * @swagger
 * /devices/admin/getDevices:
 *   get:
 *     summary: Get all devices
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: List of devices
 */
router.get('/admin/getDevices', deviceController.viewAllDevices);

/**
 * @swagger
 * /devices/{id}/status:
 *   patch:
 *     summary: Toggle status of a device
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the device to update status
 *     responses:
 *       200:
 *         description: Device status updated successfully
 */
router.patch('/:id/status', deviceController.toggleDeviceStatus);

/**
 * @swagger
 * /devices/getAllLocations:
 *   get:
 *     summary: Get all locations
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: List of all locations
 */
router.get('/getAllLocations', deviceController.getAllLocations);

module.exports = router;
