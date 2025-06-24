const logger = require('../config/logger');
const sendEmail = require('../utils/sendEmail');
const { UserService } = require('../service');

// Create User - POST /users
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const user = await UserService.createUser({ name, email, message });
    logger.info(`User created: ${user?.id} - ${user?.email}`);

    await sendEmail(user);
    logger.info(`Notification email sent for user: ${user?.id}`);

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    logger.error(`Error in createUser: ${error?.message}`);
    next(error);
  }
};

// Get All Users - GET /users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    logger.info(`Retrieved all users. Count: ${users?.length || 0}`);
    res.status(200).json({ data: users });
  } catch (error) {
    logger.error(`Error in getAllUsers: ${error?.message}`);
    next(error);
  }
};

// Update User Status - PUT /users/:userId/status
exports.updateUserStatus = async (req, res, next) => {
  try {
    const userId = req.params?.userId;
    const status = req.body?.status;

    if (!userId || !status) {
      return res.status(400).json({ message: 'User ID and status are required' });
    }

    await UserService.updateUserStatus(userId, status);

    logger.info(`Status updated for user ${userId} -> ${status}`);
    return res.status(200).json({
      message: `User status updated to ${status}`,
      success: true,
    });
  } catch (error) {
    logger.error(`Error updating user status: ${error?.message}`);
    return res.status(500).json({
      message: 'Failed to update user status',
      error: error?.message,
    });
  }
};
