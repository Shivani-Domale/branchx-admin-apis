const deviceService = require('../service/device-service');

exports.createDevice = async (req, res) => {
  try {
    const device = await deviceService.createDevice(req?.body);
    return res.status(201).json({
      message: 'Device created successfully',
      data: device,
    });
  } catch (error) {
    console.error('Create Device Error:', error);
    return res.status(error?.statusCode || 500).json({
      message: error?.message || 'Internal server error',
      error,
    });
  }
};
