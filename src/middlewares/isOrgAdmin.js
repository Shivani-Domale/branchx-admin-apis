
const isOrgAdmin = (req, res, next) => {
    console.log('[isOrgAdmin] Decoded user:', req.user);
  if (req.user.role !== 'ORG_ADMIN') {
    return res.status(403).json({ message: 'Access denied. Only ORG_ADMIN can perform this action.' });
  }
  next();
};

module.exports = isOrgAdmin;
