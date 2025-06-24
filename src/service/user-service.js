const userRepository = require('../repositories/user-repository');
const sendCredentialsEmail = require('../utils/sendCredentialsEmail');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

exports.createUser = async (data) => {
  try {
    const user = await userRepository.create(data);
    await sendEmail(user);
    return user;
  } catch (error) {
    console.error(`Error in createUser: ${error?.message}`);
    throw new Error(`Error creating user: ${error?.message}`);
  }
};

exports.getAllUsers = async () => {
  try {
    return await userRepository.getAllUsers();
  } catch (error) {
    console.error(`Error in getAllUsers: ${error?.message}`);
    throw new Error(`Error retrieving users: ${error?.message}`);
  }
};

exports.updateUserStatus = async (userId, status) => {
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.status = status;

    if (status === 'ACTIVE') {
      const randomPassword = Math.random().toString(36).slice(-5);
      const hashedPassword = await bcrypt.hash(randomPassword, 8);
      
      console.log(`Generated Password: ${randomPassword}`);
      
      user.password = hashedPassword;
      await sendCredentialsEmail(user, randomPassword);
    } else {
      user.password = null;
    }

    await user.save();
    return user;

  } catch (error) {
    console.error(`Error in updateUserStatus: ${error?.message}`);
    throw new Error(`Error updating user status: ${error?.message}`);
  }
};
