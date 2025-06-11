const deviceService = require('../service/device-service');

exports.createDevice = async (req, res, next) => {
  try {
    const inputType = req.body.deviceType?.trim();
    const normalizedType = inputType?.toLowerCase(); // Normalize to lowercase

    const validTypes = ['mobile', 'cube', 'cube pro', 'tv']; // Lowercase list

    if (!validTypes.includes(normalizedType)) {
      return res.status(400).json({
        message: `Invalid deviceType. Allowed types are: Mobile, Cube, Cube Pro, TV`,
      });
    }

    // Set the deviceType back to proper casing for DB
    const properCaseMap = {
      'mobile': 'Mobile',
      'cube': 'Cube',
      'cube pro': 'Cube Pro',
      'tv': 'TV',
    };
    req.body.deviceType = properCaseMap[normalizedType];

    const exists = await deviceService.isDeviceExists(req.body.deviceType);
    if (exists) {
      return res.status(400).json({
        message: 'Device with this type already exists',
      });
    }

    const device = await deviceService.createDevice(req.body);
    res.status(201).json({
      message: 'Device created successfully',
      data: device,
    });
  } catch (error) {
    next(error);
  }
};
