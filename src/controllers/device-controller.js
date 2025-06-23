const deviceService = require('../service/device-service');

exports.createDevice = async (req, res) => {
  try {
    const { deviceType, price, locationId } = req.body || {};

    // Basic validation
    if (!deviceType || !price || !locationId) {
      return res.status(400).json({
        message: 'deviceType, price, and locationId are required',
      });
    }

    const device = await deviceService.createDevice({ deviceType, price, locationId });

    return res.status(201).json({
      message: 'Device created successfully',
      data: device,
    });

  } catch (error) {
    return res.status(error?.statusCode || 500).json({
      message: error?.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined, // hide internal error in production
    });
  }
};
