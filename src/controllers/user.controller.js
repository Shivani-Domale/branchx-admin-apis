const userService = require('../service/user.service');
const logger = require('../config/logger');
const sendEmail = require('../utils/sendEmail');

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    logger.info(`User created: ${user.id} - ${user.email}`);

    // Send notification email on new contact form submission
    await sendEmail(user);
    logger.info(`Notification email sent for user: ${user.id}`);

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    logger.error(`Error in createUser: ${error.message}`);
    next(error);
  }
};

// exports.getUser = async (req, res, next) => {
//   try {
//     const user = await userService.getUser(req.params.id);
//     if (!user) {
//       logger.warn(`User not found: ${req.params.id}`);
//       return res.status(404).json({ message: 'User not found' });
//     }
//     logger.info(`User retrieved: ${user.id}`);
//     res.status(200).json(user);
//   } catch (error) {
//     logger.error(`Error in getUser: ${error.message}`);
//     next(error);
//   }
// };

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    logger.info(`Retrieved all users. Count: ${users.length}`);
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error in getAllUsers: ${error.message}`);
    next(error);
  }
};