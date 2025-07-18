const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { ServerConfig } = require('../../config');

const sendResetCodeEmail = require('../../utils/sendResetCodeEmail');
const sendCredentialsEmail = require('../../utils/sendCredentialsEmail');
const { AdminRepository } = require('../../repositories');


const adminRespository = new AdminRepository();

//// Get Admin by ID
exports.getAdminById = async (adminId) => {
  if (!adminId) {
    throw new Error('Admin ID is required');
  }

  const admin = await adminRespository.fechAdminProfile(adminId);
  if (!admin) {
    throw new Error('Admin not found');
  }

  return admin;
};

//// Get All Admins
exports.getAllAdmins = async () => {
  const admins = await adminRespository.findAll();
  return admins;
};



exports.updateAdminDetails = async (adminId, updateData) => {
  if (!adminId || !updateData) {
    throw new Error('Admin ID and update data are required');
  }

  const admin = await adminRespository.findById(adminId);
  if (!admin) {
    throw new Error('Admin not found');
  }

  const allowedFields = ['name', 'email', 'phone', 'address', 'state', 'country', 'city', 'profile_url'];
  const filteredData = {};

  // Normalization function (case-insensitive, trimmed)
  const normalizeValue = (val) => {
    return val === null || val === undefined ? '' : String(val).trim();
  };

  // Compare each field
  for (const field of allowedFields) {
    if (!(field in updateData)) continue;

    const newValue = updateData[field];
    const oldValue = admin[field];

    const normOld = normalizeValue(oldValue);
    const normNew = normalizeValue(newValue);

    if (normNew !== normOld) {
      filteredData[field] = newValue;
    }
  }


  // Optional: Email uniqueness check

  if (Object.keys(filteredData).length === 0) {
    return 'No changes detected';
  }


  await adminRespository.updateAdmin(admin, filteredData);

  return 'Profile updated successfully' ;
};



