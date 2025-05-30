const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  ORG_ADMIN_EMAIL: process.env.ORG_ADMIN_EMAIL || 'orgadmin@branchx.com',
  ORG_ADMIN_PASSWORD: process.env.ORG_ADMIN_PASSWORD || 'orgadmin123',
};
