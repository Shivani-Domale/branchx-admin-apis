const nodemailer = require('nodemailer');
const Logger = require('../config/logger'); // Adjust path as needed

module.exports = async (user,randomPassword) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD, 
      },
    });

    const message = {
      from: `"BranchX Admin" <${process.env.ADMIN_EMAIL}>`,
      to: user.email, // Send to the user's email
      subject: 'Your Account Credentials',
      text: `Hello ${user.fullName},

Your account has been created successfully. Here are your login credentials:

Email: ${user.email}
Password: ${randomPassword}

Please log in and change your password after first login.

Thank you,
Team Support`,
    };

    const info = await transporter.sendMail(message);
    Logger.info(`Credentials email sent to ${user.email}: ${info.messageId}`);
  } catch (error) {
    Logger.error(`Failed to send credentials email: ${error.message}`);
    throw error;
  }
};
