const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../config');

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ServerConfig.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized or token invalid' });
  }
};

exports.isOrgAdmin = (req, res, next) => {
  if (req.user.role !== 'ORG_ADMIN') {
    return res.status(403).json({ message: 'Only Org Admins are allowed' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user || !['ADMIN', 'ORG_ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied. Not an admin.' });
  }
  next();
};

module.exports = isAdmin;
