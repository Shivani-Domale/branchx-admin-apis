const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const  isAdmin = require('../middlewares/auth.middleware');
const verifyToken = require('../middlewares/verifyToken');
const isOrgAdmin = require('../middlewares/isOrgAdmin');

// Create admin (only ORG_ADMINs can do this)
router.post('/register', verifyToken, isOrgAdmin, adminController.registerAdmin);

// Admin login (open to all)
router.post('/login', adminController.loginAdmin);

// Protected example (any admin)
router.get('/dashboard', verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.role}!` });
});

// Forgot Password and Reset Password
// router.post('/forgot-password', adminController.forgotPassword);
// router.post('/reset-password', adminController.resetPassword);

module.exports = router;
