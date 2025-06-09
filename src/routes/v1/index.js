const express = require('express');
const campaignRoutes = require('./campaign-routes');
const userRoutes = require('./user-routes');
const adminRoutes = require('./admin-routes');
const router = express.Router();

router.use('/campaigns',campaignRoutes);
router.use('/users',userRoutes);
router.use('/auth', adminRoutes);
module.exports = router;