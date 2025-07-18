const express = require('express');
const { AdminController } = require('../../controllers');
const verifyToken = require('../../middlewares/verifyToken');
const { isAdmin } = require('../../middlewares/auth-middleware');
const router = express.Router();

// fetch  admin  profile
router.get('/getProfile', verifyToken, isAdmin, AdminController.getAdminById);

//  Update admin details
router.put('/editProfile', verifyToken, isAdmin, AdminController.updateAdminDetails);

module.exports = router;