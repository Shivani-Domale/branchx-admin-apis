const logger = require('../config/logger');
const sendEmail = require('../utils/sendEmail');
const { UserService } = require('../service');
const { StatusCodes } = require('http-status-codes');
const userService = require('../service/user-service');
const successResponse = require('../utils/errorHandler/successResponse');
const errorResponse = require('../utils/errorHandler/errorResponse');
const { User } = require('../models');


exports.createUser = async (req, res, next) => {
  try {
    const email = req?.body?.email;

    if (!email) {
      errorResponse(res, StatusCodes.BAD_REQUEST, "Email is required", null);
      return;
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      errorResponse(res, StatusCodes.NOT_ACCEPTABLE, "Email Already Exists !!", null);
      return;
    }

    const user = await userService.createUser(req?.body);
    logger?.info?.(`User created: ${user?.id} - ${user?.email}`);

    // Send notification email
    await sendEmail(user);
    logger?.info?.(`Notification email sent for user: ${user?.id}`);

    successResponse(res, "User Created SuccessFully !", StatusCodes.CREATED, user);
  } catch (error) {
    logger?.error?.(`Error in createUser: ${error?.message}`);
    next(error);
  }
};


exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    logger.info(`Retrieved all users. Count: ${users?.length}`);
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error in getAllUsers: ${error?.message}`);
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const userId = req?.params?.userId;
    const status = req?.body?.status;

    const updateStatus = await UserService.updateUserStatus(userId, status);
    logger.info(`User status updated: ${userId} -> ${status}`);

    return res.status(200).json({
      message: `${status} updated successfully`,
      success: true,
      status: 200,
    });
  } catch (error) {
    logger.error(`Error in updateUserStatus: ${error?.message}`);
    return res.status(500).json({ error: `Error updating user status: ${error?.message}` });
  }
};
