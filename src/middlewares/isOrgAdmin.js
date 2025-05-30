
const isOrgAdmin = (req, res, next) => {
  if (req.user.role !== 'ORG_ADMIN') {
    return res.status(403).json({ message: 'Access denied. Org Admin only.' });
  }
  next();
};

module.exports = isOrgAdmin;
