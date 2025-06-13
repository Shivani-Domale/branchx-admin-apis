const { AdminService } = require("../service");

/*
Shivani Domale
*/


//Admin Registration - POST /admin/register
exports.registerAdmin = async (req, res) => {
  try {
    const newAdmin = await AdminService.registerAdmin(req.body);
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