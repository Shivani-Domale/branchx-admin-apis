const { AdminService } = require("../../service");
const { SuccessResponse } = require("../../utils");
const { StatusCodes } = require('http-status-codes');



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
    
    SuccessResponse(res,result,StatusCodes.OK,null);
  } catch (err) {
    console.error('Update admin details error:', err.message);
    res.status(400).json({ message: err.message });
  }
};