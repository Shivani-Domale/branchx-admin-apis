const express = require('express');
const campaignRoutes = require('./campaign-routes');
const userRoutes = require('./user.routes');
const router = express.Router();

router.use('/campaigns',campaignRoutes);
router.use('/users',userRoutes);

module.exports = router;