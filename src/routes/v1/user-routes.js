const express = require('express');
const router = express.Router();
// const validateUser = require('../../middlewares/validate-User');
const { UserController } = require('../../controllers');
 



// Route to create user (kept commented as per request)
// router.post('/', validateUser, UserController.createUser);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs (Admin only)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/', UserController.getAllUsers);

/**
 * @swagger
 * /users/{userId}/status:
 *   put:
 *     summary: Update user status (enable/disable)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: User status updated
 */
router.put('/:userId/status', UserController.updateUserStatus);


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User-related APIs
 */

/**
 * @swagger
 * /users/createUser:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/addUser', UserController.createUser);

module.exports = router;
