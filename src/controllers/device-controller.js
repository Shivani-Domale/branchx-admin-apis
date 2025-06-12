// const deviceService = require('../service/device-service');

// exports.createDevice = async (req, res, next) => {
//   try {
//     const inputType = req.body.deviceType?.trim().toLowerCase();

//     const validTypes = ['mobile', 'cube', 'cube pro', 'tv'];
//     if (!validTypes.includes(inputType)) {
//       return res.status(400).json({ message: 'Invalid deviceType. Allowed types: Mobile, Cube, Cube Pro, TV' });
//     }

//     // Map input to proper case
//     const typeMap = {
//       'mobile': 'Mobile',
//       'cube': 'Cube',
//       'cube pro': 'Cube Pro',
//       'tv': 'TV'
//     };
//     const properDeviceType = typeMap[inputType];
//     req.body.deviceType = properDeviceType;

//     // Check if deviceType already exists
//     const exists = await deviceService.isDeviceExists(properDeviceType);
//     if (exists) {
//       return res.status(400).json({ message: 'Device with this type already exists' });
//     }

//     const device = await deviceService.createDevice(req.body);
//     return res.status(201).json({ message: 'Device created successfully', data: device });

//   } catch (error) {
//     next(error);
//   }
// };

const deviceService = require('../service/device-service');

exports.createDevice = async (req, res, next) => {
  try {
    const inputType = req.body.deviceType?.trim();
    const normalizedType = inputType?.toLowerCase();

    const validTypes = ['mobile', 'cube', 'cube pro', 'tv'];
    if (!validTypes.includes(normalizedType)) {
      return res.status(400).json({
        message: `Invalid deviceType. Allowed types are: Mobile, Cube, Cube Pro, TV`,
      });
    }

    // Map to proper case
    const properCaseMap = {
      'mobile': 'Mobile',
      'cube': 'Cube',
      'cube pro': 'Cube Pro',
      'tv': 'TV',
    };
    req.body.deviceType = properCaseMap[normalizedType];

    // Normalize location
    const toTitleCase = (str) => str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    const formattedLocation = toTitleCase(req.body.locationName?.trim());

    if (!formattedLocation) {
      return res.status(400).json({ message: 'Location name is required' });
    }

    // Find location
    const locationRecord = await deviceService.getLocationByCity(formattedLocation);
    if (!locationRecord) {
      return res.status(404).json({ message: `Location "${formattedLocation}" not found` });
    }

    req.body.locationId = locationRecord.id;
    delete req.body.locationName;

    // Check if device exists at that location
    const exists = await deviceService.isDeviceExists(req.body.deviceType, req.body.locationId);
    if (exists) {
      return res.status(400).json({
        message: `${req.body.deviceType} already exists in ${formattedLocation}`,
      });
    }

    // Set availableCount = deviceCount if not provided
    if (req.body.availableCount === undefined && req.body.deviceCount !== undefined) {
      req.body.availableCount = req.body.deviceCount;
    }

    const created = await deviceService.createDevice(req.body);
    return res.status(201).json({
      message: 'Device created successfully',
      data: created,
    });

  } catch (error) {
    next(error);
  }
};
