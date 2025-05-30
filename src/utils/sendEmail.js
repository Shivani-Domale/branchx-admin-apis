// utils/sendEmail.js
const nodemailer = require('nodemailer');
const Logger = require('../config/logger'); // Assuming you have a logger configured


module.exports = async (user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:  process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const message = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      text: `New message from ${user.fullName}:

Phone: ${user.phone}
Email: ${user.email}
Location: ${user.city}, ${user.state}, ${user.country}
Role: ${user.role}
Business Name: ${user.businessName}

Message:
${user.message}`,
    };

    const info = await transporter.sendMail(message);
    Logger.info(`Email sent: ${info.messageId}`);
  } catch (error) {
    logger.error(`Failed to send email: ${error.message}`);
    throw error;  // rethrow to let controller handle the error if needed
  }
};
// This utility function sends an email using nodemailer  