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

exports.viewAllDevices = async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices();
    return res.status(200).json({
      message: 'Devices fetched successfully',
      data: devices,
    });
  } catch (error) {
    console.error('View All Devices Error:', error);
    return res.status(error?.statusCode || 500).json({
      message: error?.message || 'Internal server error',
      error,
    });
  }
};

exports.toggleDeviceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deviceService.toggleDeviceStatus(id);

    res.status(200).json({
      message: `Device status updated from ${result.oldStatus} to ${result.newStatus}`,
      deviceId: result.id,
    });
  } catch (error) {
    console.error('Error in toggleDeviceStatus controller:', error);
    res.status(500).json({
      message: error.message || 'Failed to toggle device status',
    });
  }
};
