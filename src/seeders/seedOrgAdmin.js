require('dotenv').config();
const bcrypt = require('bcrypt');
const adminRepo = require('../repositories/admin-repository');
const { sequelize } = require('../models');

const seedOrgAdmin = async () => {
  try {
    await sequelize.authenticate();
    
    const email = process.env.ORG_ADMIN_EMAIL;
    const password = process.env.ORG_ADMIN_PASSWORD;

    const existingAdmin = await adminRepo.findByEmail(email);
    if (existingAdmin) {
      console.log('Org Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = {
      name: 'Org Admin',
      email,
      password: hashedPassword,
      role: 'ORG_ADMIN',
      resetToken: null,
      resetTokenExpire: null
    };

    await adminRepo.createAdmin(newAdmin);
    console.log('Org Admin seeded successfully');
  } catch (error) {
    console.error('Error seeding Org Admin:', error);
  } finally {
    await sequelize.close();
  }
};

seedOrgAdmin();
