const express = require('express');
const router = express.Router();
const deviceController = require('../../controllers/device-controller');
const validate = require('../../validator/validate');
const deviceSchemas = require('../../validator/device-schemas');

router.post(
  '/admin/devices',
  validate(deviceSchemas.createDevice),
  deviceController.createDevice
);

module.exports = router;
