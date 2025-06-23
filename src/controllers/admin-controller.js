const { AdminService } = require("../service");

/*
Shivani Domale
*/


//Admin Registration - POST /admin/register
exports.registerAdmin = async (req, res) => {
  try {
    const name = req.body?.name;
    const email = req.body?.email;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const newAdmin = await AdminService.registerAdmin({ name, email });
    res.status(201).json({ message: 'Admin registered successfully', data: newAdmin });
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Internal Server Error' });
  }
};


//Admin Login - POST /admin/login
exports.loginAdmin = async (req, res) => {
  try {
    const { role, token } = await AdminService.loginAdmin(req.body);
    res.status(200).json({ message: `${role} login successful`, token });
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Internal Server Error' });
  }
};

// Forgot Password - POST /admin/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body?.email;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    await AdminService.forgotPassword(email);
    res.status(200).json({ message: 'Reset token sent to email' });
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Internal Server Error' });
  }
};

// Verify Reset Code - POST /admin/verify-reset-code
exports.verifyResetCode = async (req, res) => {
  try {
    await AdminService.verifyResetCode(req.body);
    res.status(200).json({ message: 'Reset token verified successfully.' });
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Internal Server Error' });
  }
};

// Reset Password  - POST /admin/reset-password
exports.resetPassword = async (req, res) => {
  try {
    await AdminService.resetPassword(req.body);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Internal Server Error' });
  }
};

// Change Password - POST /admin/change-password
exports.changePassword = async (req, res) => {
  try {
    const email = req.body?.email;
    const oldPassword = req.body?.oldPassword;
    const newPassword = req.body?.newPassword;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Email, old password, and new password are required' });
    }

    await AdminService.changePassword({ email, oldPassword, newPassword });
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Internal Server Error' });
  }
};

// Get Admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const id = req.params?.id;
    const admin = await AdminService.getAdminById(id);
    res.status(200).json({ data: admin });
  } catch (err) {
    res.status(404).json({ message: err?.message || 'Internal Server Error' });
  }
};

// Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminService.getAllAdmins();
    res.status(200).json({ data: admins });
  } catch (err) {
    res.status(500).json({ message: err?.message || 'Internal Server Error' });
  }
};

// Update Admin Details
exports.updateAdminDetails = async (req, res) => {
  try {
    const id = req.params?.id;
    const result = await AdminService.updateAdminDetails(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Internal Server Error' });
  }
};