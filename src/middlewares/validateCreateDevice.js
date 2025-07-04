module.exports = (req, res, next) => {
  const {
    deviceName,
    resolutionHeight,
    resolutionWidth,
    orientation,
    locationName,
  } = req.body;

  const errors = [];

  if (!deviceName || typeof deviceName !== 'string' || !deviceName.trim()) {
    errors.push({ field: 'deviceName', message: 'Device name is required and must be a string.' });
  }

  if (!resolutionHeight || isNaN(resolutionHeight) || resolutionHeight <= 0) {
    errors.push({ field: 'resolutionHeight', message: 'Resolution height must be a positive number.' });
  }

  if (!resolutionWidth || isNaN(resolutionWidth) || resolutionWidth <= 0) {
    errors.push({ field: 'resolutionWidth', message: 'Resolution width must be a positive number.' });
  }

  const allowedOrientations = ['Horizontal', 'Vertical'];
  if (!orientation || !allowedOrientations.includes(orientation)) {
    errors.push({ field: 'orientation', message: `Orientation must be one of: ${allowedOrientations.join(', ')}` });
  }

  if (!locationName || typeof locationName !== 'string' || !locationName.trim()) {
    errors.push({ field: 'locationName', message: 'Location name is required and must be a string.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
