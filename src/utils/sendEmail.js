// utils/sendEmail.js
const nodemailer = require('nodemailer');
const Logger = require('../config/logger');
require('dotenv').config();

module.exports = async (user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const message = {
      from: `"${user.fullName}" <${process.env.ADMIN_EMAIL}>`, // Gmail will use this sender
      to: process.env.ADMIN_EMAIL,
      replyTo: user.email, // ✅ Makes replies go to the actual user
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
    Logger.error(`Failed to send email: ${error.message}`);
    throw error;
  }
};
