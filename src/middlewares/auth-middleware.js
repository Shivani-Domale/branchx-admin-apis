const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../config');

const isOrgAdmin = (req, res, next) => {
  if (req.user.role !== 'SUPERADMIN') {
    return res.status(403).json({ message: 'Only Org Admins are allowed' });
  }
  next();
};

const isAdmin = (req, res, next) => {

  if (!req.user || !['ADMIN', 'SUPERADMIN'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied. Not an admin.' });
  }
  next();
};


module.exports = {
  isOrgAdmin,
  isAdmin
};
