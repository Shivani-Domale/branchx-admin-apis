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