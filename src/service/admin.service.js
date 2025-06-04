const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { ServerConfig } = require('../config');
const adminRepo = require('../repositories/admin.repository');
const sendResetCodeEmail = require('../utils/sendResetCodeEmail');

//// Register a new admin
exports.registerAdmin = async ({ name, email, password }) => {
  // Validate input
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }
  // Check if the email is already registered
  const existingAdmin = await adminRepo.findByEmail(email);
  if (existingAdmin) {
    throw new Error('Email already registered');
  }
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create the admin in the database
  return adminRepo.createAdmin({ name, email, password: hashedPassword, role: 'ADMIN' });
};

//// Login admin
exports.loginAdmin = async ({ email, password }) => {
    // Validate input
    if (!email || !password) {
    throw new Error('Email and password are required');
    }
    // Check if the email and password match the organization admin credentials
    if (email === ServerConfig.ORG_ADMIN_EMAIL && password === ServerConfig.ORG_ADMIN_PASSWORD) {
    const token = jwt.sign(
        { email, role: 'ORG_ADMIN' },
        ServerConfig.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return { role: 'ORG_ADMIN', token };
    }
    // For other admins, check the database
    const admin = await adminRepo.findByEmail(email);
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        throw new Error('Invalid email or password');
    }
    // Generate JWT token for the admin
    const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        ServerConfig.JWT_SECRET,
        { expiresIn: '1h' }
    );

  return { role: admin.role, token };
};

//// Forgot password functionality
exports.forgotPassword = async (email) => {
  // Validate input
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email format');
  }  
  // Check if the email is registered
  if (!email) throw new Error('Email is required');
  const admin = await adminRepo.findByEmail(email);
  if (!admin) {
    throw new Error('Admin not found');
    //return { status: 404, message: 'Admin not found' };
  }
  // Generate a reset token and expiry time
  const resetToken = crypto.randomBytes(20).toString('hex');
  const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
  // Update the admin record with the reset token and expiry
  admin.resetToken = resetToken;
  admin.resetTokenExpire = tokenExpiry;
  await adminRepo.updateAdmin(admin, {
    resetToken,
    resetTokenExpire: tokenExpiry,
  });
  // Send the reset token to the admin's email
  await sendResetCodeEmail(email, resetToken);
};

//// Verify the reset code
exports.verifyResetCode = async ({ email, resetToken }) => {
   // Validate input
  if (!email || !resetToken) {
    throw new Error('Email and reset token are required');
  }  
  // Check if the admin exists and has a valid reset token
  const admin = await adminRepo.findByEmail(email);
  if (!admin || !admin.resetToken || !admin.resetTokenExpire) {
    throw new Error('Invalid or expired reset token.');
  }
  // Check if the reset token is valid and not expired
  const isValid = admin.resetToken === resetToken && new Date(admin.resetTokenExpire) > new Date();
  if (!isValid) throw new Error('Invalid or expired reset token.');
};

//// Reset the password
exports.resetPassword = async ({ email, resetToken, newPassword }) => {
  // Validate input
  if (!email || !resetToken || !newPassword) {
    throw new Error('Email, reset token, and new password are required');
  }  
  // Fetch the admin by email
  const admin = await adminRepo.findByEmail(email);
  // Admin not found
  if (!admin) {
    throw new Error('Admin not found');
  }
  // Token mismatch
  if (admin.resetToken !== resetToken) {
    throw new Error('Invalid reset token');
  }
  // Token expired
  if (new Date(admin.resetTokenExpire) < new Date()) {
    throw new Error('Reset token has expired');
  }
  // Validate new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await adminRepo.updateAdmin(admin, {
    password: hashedPassword,
    resetToken: null,
    resetTokenExpire: null,
  });
};