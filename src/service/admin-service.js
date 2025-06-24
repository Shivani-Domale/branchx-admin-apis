const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { ServerConfig } = require('../config');
const adminRepo = require('../repositories/admin-repository');
const sendResetCodeEmail = require('../utils/sendResetCodeEmail');
const sendCredentialsEmail = require('../utils/sendCredentialsEmail');

// Generate a secure random password
const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex'); // 16 characters
};

// Note: Org Admin (orgadmin@branchx.com) is seeded via a one-time script
// located at src/seeders/seedOrgAdmin.js. It must exist in the database
// to allow login and token generation for the Org Admin role.
// npm run seed:orgadmin


// Register a new admin
exports.registerAdmin = async ({ name, email }) => {
  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  const existingAdmin = await adminRepo.findByEmail(email);
  if (existingAdmin) {
    throw new Error('Email already registered');
  }

  const plainPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const newAdmin = await adminRepo.createAdmin({
    name,
    email,
    password: hashedPassword,
    role: 'ADMIN',
  });

  await sendCredentialsEmail({ email, fullName: name }, plainPassword);
  
  return newAdmin;
};

// Login admin
exports.loginAdmin = async ({ email, password }) => {
    if (!email || !password) {
    throw new Error('Email and password are required');
    }

    if (email === ServerConfig.ORG_ADMIN_EMAIL && password === ServerConfig.ORG_ADMIN_PASSWORD) {
    
    const admin = await adminRepo.findByEmail(email);

    const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        ServerConfig.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { role: admin.role, token };
    }

    const admin = await adminRepo.findByEmail(email);
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        ServerConfig.JWT_SECRET,
        { expiresIn: '1h' }
    );

  return { role: admin.role, token };
};

// Forgot password 
exports.forgotPassword = async (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email format');
  }  

  if (!email) throw new Error('Email is required');
  const admin = await adminRepo.findByEmail(email);

  if (!admin) {
    throw new Error('Admin not found');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  admin.resetToken = resetToken;
  admin.resetTokenExpire = tokenExpiry;

  await adminRepo.updateAdmin(admin, {
    resetToken,
    resetTokenExpire: tokenExpiry,
  });

  await sendResetCodeEmail(email, resetToken);
};

// Verify the reset code
exports.verifyResetCode = async ({ email, resetToken }) => {
  if (!email || !resetToken) {
    throw new Error('Email and reset token are required');
  }  

  const admin = await adminRepo.findByEmail(email);
  if (!admin || !admin.resetToken || !admin.resetTokenExpire) {
    throw new Error('Invalid or expired reset token.');
  }

  const isValid = admin.resetToken === resetToken && new Date(admin.resetTokenExpire) > new Date();
  if (!isValid) throw new Error('Invalid or expired reset token.');
};

// Reset the password
exports.resetPassword = async ({ email, resetToken, newPassword }) => {
  if (!email || !resetToken || !newPassword) {
    throw new Error('Email, reset token, and new password are required');
  }  

  const admin = await adminRepo.findByEmail(email);
  if (!admin) {
    throw new Error('Admin not found');
  }

  if (admin.resetToken !== resetToken) {
    throw new Error('Invalid reset token');
  }

  if (new Date(admin.resetTokenExpire) < new Date()) {
    throw new Error('Reset token has expired');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await adminRepo.updateAdmin(admin, {
    password: hashedPassword,
    resetToken: null,
    resetTokenExpire: null,
  });
};

// Change password for the admin
exports.changePassword = async ({ email, oldPassword, newPassword }) => {
  if (!email || !oldPassword || !newPassword) {
    throw new Error('Email, old password, and new password are required');
  }

  const admin = await adminRepo.findByEmail(email);
  if (!admin) {
    throw new Error('Admin not found');
  }

  const isMatch = await bcrypt.compare(oldPassword, admin.password);
  if (!isMatch) {
    throw new Error('Old password is incorrect');
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await adminRepo.updateAdmin(admin, { password: hashedNewPassword });
};

// Get Admin by ID
exports.getAdminById = async (adminId) => {
  if (!adminId) {
    throw new Error('Admin ID is required');
  }

  const admin = await adminRepo.findById(adminId);
  if (!admin) {
    throw new Error('Admin not found');
  }

  return admin;
};

// Get All Admins
exports.getAllAdmins = async () => {
  const admins = await adminRepo.findAll();
  return admins;
};

// Update Admin Details
exports.updateAdminDetails = async (adminId, updateData) => {
  if (!adminId || !updateData) {
    throw new Error('Admin ID and update data are required');
  }

  const admin = await adminRepo.findById(adminId);
  if (!admin) {
    throw new Error('Admin not found');
  }

  if (admin.email === ServerConfig.ORG_ADMIN_EMAIL) {
    throw new Error("Cannot update Org Admin details");
  }

  await adminRepo.updateAdmin(admin, updateData);
  return { message: 'Admin details updated successfully' };
};
