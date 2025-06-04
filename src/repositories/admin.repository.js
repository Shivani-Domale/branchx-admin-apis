const {Admin} = require('../models');

const findByEmail = async (email) => {
    return await Admin.findOne({ where: { email } });
};

const findByEmailAndToken = async (email, token) => {
    return await Admin.findOne({ where: { email, resetToken: token } });
};

const createAdmin = async (adminData) => {
    return await Admin.create(adminData);
};

const updateAdmin = async (adminInstance, updateData) => {
    return await adminInstance.update(updateData);
};

module.exports = {
    findByEmail,
    createAdmin,
    updateAdmin,
    findByEmailAndToken
};