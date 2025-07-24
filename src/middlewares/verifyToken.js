const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../config');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  console.log('Authorization Header:', authHeader); // <-- KEY DEBUG POINT

  // Check header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided or malformed Authorization header.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ServerConfig.JWT_SECRET);
    req.user = decoded;
    console.log('decoded',decoded);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};

module.exports = verifyToken;




// const jwt = require('jsonwebtoken');
// const { ServerConfig } = require('../config');

// const verifyToken = (req, res, next) => {
//   console.log('rquest',req);
//   const token = req.headers.authorization?.split(' ')[1];

 
//   if (!token) {
//     return res.status(403).json({ message: 'No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, ServerConfig.JWT_SECRET);
    
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error('Token verification failed:', err.message);
//     return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
//   }
// };

// module.exports = verifyToken;
