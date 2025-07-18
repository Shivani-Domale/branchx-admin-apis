/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication and management APIs
 */

const express = require('express');
const router = express.Router();
const { AuthController } = require('../../controllers');
const verifyToken = require('../../middlewares/verifyToken');
const { isAdmin, isOrgAdmin } = require('../../middlewares/auth-middleware');

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', AuthController.loginAdmin);

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new admin (ORG_ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *               role:
 *                 type: string
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       403:
 *         description: Unauthorized
 */
router.post('/register', verifyToken, isOrgAdmin, AuthController.registerAdmin);

// ----------------------------------------
// COMMENTED ROUTES (for future activation)
// ----------------------------------------

// // Protected example (any admin)
// router.get('/dashboard', verifyToken, isAdmin, (req, res) => {
//   res.status(200).json({ message: `Welcome ${req.user.role}!` });
// });

// // Password reset routes
// router.post('/forgot-password', AuthController.forgotPassword);
// router.post('/verify-reset-code', AuthController.verifyResetCode);
// router.post('/reset-password', AuthController.resetPassword);

// // Change password route
// router.post('/change-password', verifyToken, isAdmin, AuthController.changePassword);

// // Get all admins
// router.get('/get-all-admins', verifyToken, isOrgAdmin, AuthController.getAllAdmins);

// // Get admin by ID
// router.get('/getEditProfile', verifyToken, isAdmin, AuthController.getAdminById);

// // Update admin details
// router.put('/updateProfile', verifyToken, isAdmin, AuthController.updateAdminDetails);

module.exports = router;
