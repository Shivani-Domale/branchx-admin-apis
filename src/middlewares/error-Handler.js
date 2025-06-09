const logger = require("../config/logger");

module.exports = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}`);

  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message,
  });
};
