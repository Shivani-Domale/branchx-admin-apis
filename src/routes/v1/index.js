const express = require('express');
const campaignRoutes = require('./campaign-routes');
const router = express.Router();

router.use('/campaigns',campaignRoutes);

module.exports = router;