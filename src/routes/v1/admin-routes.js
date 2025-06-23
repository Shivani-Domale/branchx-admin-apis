const express = require('express');
const router = express.Router();
const { adminController } = require('../../controllers');
const verifyToken = require('../../middlewares/verifyToken');
const { isAdmin, isOrgAdmin } = require('../../middlewares/auth-middleware');

// Admin login (open to all)
router.post('/login', adminController.loginAdmin);

// Create admin (only ORG_ADMINs can do this)
router.post('/register', verifyToken, isOrgAdmin, adminController.registerAdmin);

// Protected example (any admin)
router.get('/dashboard', verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.role}!` });
});

// Password reset routes
router.post('/forgot-password', adminController.forgotPassword);
router.post('/verify-reset-code', adminController.verifyResetCode);
router.post('/reset-password', adminController.resetPassword);

// Change password route
router.post('/change-password', verifyToken, isAdmin, adminController.changePassword);

// Get all admins
router.get('/get-all-admins', verifyToken, isOrgAdmin, adminController.getAllAdmins);

// Get admin by ID (placed below '/')
router.get('/admin/:id', verifyToken, isAdmin, adminController.getAdminById);

// Update admin details
router.put('/admin/:id', verifyToken, isAdmin, adminController.updateAdminDetails);

module.exports = router;
