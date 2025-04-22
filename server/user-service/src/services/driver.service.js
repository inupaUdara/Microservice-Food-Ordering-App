const Driver = require("../models/driver.model.js");

// Update driver location using GeoJSON
const updateDriverLocation = async (driverId, latitude, longitude) => {
  if (!driverId || latitude == null || longitude == null) {
    throw new Error("Missing required fields");
  }
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new Error("Driver not found");
  }
  driver.currentLocation = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)]
  };
  await driver.save();
  return { success: true, message: "Driver location updated successfully" };
};

// Get nearest available driver
const findAvailableDriver = async (latitude, longitude) => {
  return await Driver.findOne({
    isAvailable: true,
    currentLocation: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: 5000, // 5km radius
      },
    },
  });
};

// Update driver availability status
const updateDriverAvailability = async (driverId, isAvailable) => {
  const driver = await Driver.findById(driverId);
  if (!driver) return null;
  driver.isAvailable = isAvailable;
  await driver.save();
  return driver;
};

module.exports = {
  findAvailableDriver,
  updateDriverAvailability,
  updateDriverLocation,
};
