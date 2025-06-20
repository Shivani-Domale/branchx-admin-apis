const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../config');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log('Received Token:', token);
  console.log('JWT Secret:', ServerConfig.JWT_SECRET);

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, ServerConfig.JWT_SECRET);
    console.log('Decoded Token Payload:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};

module.exports = verifyToken;
