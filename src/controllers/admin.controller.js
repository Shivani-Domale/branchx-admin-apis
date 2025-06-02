const { Admin } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../config');
const sendResetCodeEmail = require('../utils/sendResetCodeEmail');
const crypto = require('crypto');


// Register a new admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('name:', name);
    console.log('email:', email);
    console.log('password:', password);

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin with fixed role
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN' // Forcefully set role
    });

    res.status(201).json({ message: 'Admin registered successfully', data: newAdmin });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login an admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if it's the Org Admin
    if (email === ServerConfig.ORG_ADMIN_EMAIL && password === ServerConfig.ORG_ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email, role: 'ORG_ADMIN' },
        ServerConfig.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.status(200).json({ message: 'Org Admin login successful', token });
    }

    // check DB for regular admins
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      ServerConfig.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    admin.resetToken = resetToken;
    admin.resetTokenExpire = tokenExpiry;
    await admin.save();

    await sendResetCodeEmail(email, resetToken);

    return res.status(200).json({ message: 'Reset token sent to email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    console.log("Request body:", req.body);
    console.log("Email:", email);
    console.log("Token:", resetToken);

    const admin = await Admin.findOne({ where: { email, resetToken } });


    if (!admin || admin.resetTokenExpire < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    admin.resetToken = null;
    admin.resetTokenExpire = null;

    await admin.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Verify Reset Code
// exports.verifyResetCode = async (req, res) => {
//   try {
//     const { email, token } = req.body;
//     const admin = await Admin.findOne({ where: { email, resetToken: token } });

//     if (!admin || admin.resetTokenExpires < new Date()) {
//       return res.status(400).json({ message: 'Invalid or expired reset token' });
//     }

//     return res.status(200).json({ message: 'Reset token is valid' });
//   } catch (err) {
//     console.error('Verify token error:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// Verify Reset Code
  exports.verifyResetCode = async (req, res) => {
  const { email, resetToken } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });

    console.log('Reset Token:', admin.resetToken);
    console.log('Reset Token received:', resetToken);
    console.log('Reset Token Expires:', admin.resetTokenExpire);

    if (!admin || !admin.resetToken || !admin.resetTokenExpire) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    const isValid =
      admin.resetToken === resetToken &&
      new Date(admin.resetTokenExpire) > new Date();

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    return res.status(200).json({ message: 'Reset token verified successfully.' });

  } catch (error) {
    console.error('Reset token verification error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};