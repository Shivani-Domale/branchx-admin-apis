const express = require('express');
const router = express.Router();
const { adminController } = require('../../controllers');
const verifyToken = require('../../middlewares/verifyToken');
const { isAdmin, isOrgAdmin } = require('../../middlewares/auth-middleware');
const validate = require('../../validator/validate');
const adminSchemas = require('../../validator/admin-schemas');

// Admin login 
router.post('/login', validate(adminSchemas.loginAdmin), adminController.loginAdmin);

// Create admin (ORG_ADMIN only)
router.post('/register', verifyToken, isOrgAdmin, validate(adminSchemas.registerAdmin), adminController.registerAdmin);

// Dashboard access (any admin)
router.get('/dashboard', verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.role}!` });
});

// Password reset flows
router.post('/forgot-password', validate(adminSchemas.forgotPassword), adminController.forgotPassword);
router.post('/verify-reset-code', validate(adminSchemas.verifyResetCode), adminController.verifyResetCode);
router.post('/reset-password', validate(adminSchemas.resetPassword), adminController.resetPassword);

// Change password (admin only)
router.post('/change-password', verifyToken, isAdmin, validate(adminSchemas.changePassword), adminController.changePassword);

// Get all admins (ORG_ADMIN only)
router.get('/get-all-admins', verifyToken, isOrgAdmin, adminController.getAllAdmins);

// Get admin by ID
router.get('/admin/:id', verifyToken, isAdmin, adminController.getAdminById);

// Update admin details
router.put('/admin/:id', verifyToken, isAdmin, adminController.updateAdminDetails);

module.exports = router;