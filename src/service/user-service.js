const userRepository = require('../repositories/user-repository');
const sendCredentialsEmail = require('../utils/sendCredentialsEmail');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const {sequelize} = require('../models')


exports.createUser = async (data) => {
  try {
    const {
      fullName,
      email,
      phone,
      country = null,
      state = null,
      city = null,
      role,
      businessName = null,
      message = null
    } = data;

    const [result] = await sequelize.query(
      `INSERT INTO "Users" 
        ("fullName", "email", "phone", "country", "state", "city", "role", "businessName", "message", "status", "createdAt", "updatedAt")
       VALUES 
        (:fullName, :email, :phone, :country, :state, :city, :role, :businessName, :message, 'PENDING', NOW(), NOW())
       RETURNING *`,
      {
        replacements: {
          fullName,
          email,
          phone,
          country,
          state,
          city,
          role,
          businessName,
          message
        },
        type: sequelize.QueryTypes.INSERT
      }
    );

    const user = result[0]; // raw INSERT returns array of inserted rows
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
