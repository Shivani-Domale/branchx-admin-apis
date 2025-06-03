const userRepository = require('../repositories/user.repository');
const sendEmail = require('../utils/sendEmail');

exports.createUser = async (data) => {
  const user = await userRepository.create(data);
  await sendEmail(user);
  return user;
};

exports.getAllUsers = async () => {
  return await userRepository.getAllUsers();
};

exports.updateUserStatus = async (userId, status) => {
  try{
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.status = status;
  await user.save();
  return user; 
} catch (error) { 
  throw new Error(`Error updating user status: ${error.message}`);
  }
}