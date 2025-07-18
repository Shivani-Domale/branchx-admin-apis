const admin = require("../models/admin");
const { AdminService } = require("../service");

/*
Shivani Domale
*/


//Admin Registration - POST /admin/register
exports.registerAdmin = async (req, res) => {
  console.log(req.body);

  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const newAdmin = await AdminService.registerAdmin({ name, email });
    res.status(201).json({ message: 'Admin registered successfully', data: newAdmin });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(400).json({ message: err.message || 'Internal Server Error' });
  }
};


//Admin Login - POST /admin/login
exports.loginAdmin = async (req, res) => {
  try {
    const { role, token } = await AdminService.loginAdmin(req.body);
    res.status(200).json({ message: `${role} login successful`, token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(400).json({ message: err.message || 'Internal Server Error' });
  }
};

//Forgot Password - POST /admin/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    await AdminService.forgotPassword(req.body.email);
    res.status(200).json({ message: 'Reset token sent to email' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(400).json({ message: err.message || 'Internal Server Error' });
  }
};

//Verify Reset Code - POST /admin/verify-reset-code
exports.verifyResetCode = async (req, res) => {
  try {
    await AdminService.verifyResetCode(req.body);
    res.status(200).json({ message: 'Reset token verified successfully.' });
  } catch (err) {
    console.error('Verify token error:', err.message);
    res.status(400).json({ message: err.message || 'Internal Server Error' });
  }
};

//Reset Password  - POST /admin/reset-password
exports.resetPassword = async (req, res) => {
  try {
    await AdminService.resetPassword(req.body);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(400).json({ message: err.message || 'Internal Server Error' });
  }
};

// Change Password - POST /admin/change-password
exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    await AdminService.changePassword({ email, oldPassword, newPassword });
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const isAdminLogin = req?.user;
    if (!isAdminLogin) {
      throw new Error("Please Login to Update Profile !");
    }

    const admin = await AdminService.getAdminById(isAdminLogin.id);
    res.status(200).json({ data: admin });
  } catch (err) {
    console.error('Get admin by ID error:', err.message);
    res.status(404).json({ message: err.message });
  }
};

// Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminService.getAllAdmins();
    res.status(200).json({ data: admins });
  } catch (err) {
    console.error('Get all admins error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Update Admin Details
exports.updateAdminDetails = async (req, res) => {
  console.log(req.user);
  try {
    const result = await AdminService.updateAdminDetails(req?.user?.id, req.body);
    console.log(req?.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('Update admin details error:', err.message);
    res.status(400).json({ message: err.message });
  }
};