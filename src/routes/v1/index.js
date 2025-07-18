const express = require('express');
const campaignRoutes = require('./campaign-routes');
const userRoutes = require('./user-routes');
const authRoutes = require('./auth-routes');
const deviceRoutes = require('./device-routes');
const adminRoutes  = require('./admin-routes');
const router = express.Router();

router.use('/campaigns',campaignRoutes);
router.use('/users',userRoutes);
router.use('/auth', authRoutes);
router.use('/devices', deviceRoutes);
router.use('/admin',adminRoutes)
module.exports = router;