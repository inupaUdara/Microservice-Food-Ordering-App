const {
  findAvailableDriver,
  updateDriverAvailability,
  updateDriverLocation,
} = require("../services/driver.service.js");
const Driver = require("../models/driver.model.js");

const updateLocation = async (req, res) => {
    try {
        const { driverId, latitude, longitude } = req.body;
    
        const result = await updateDriverLocation(driverId, latitude, longitude);
    
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};
// Get nearest available driver
const getAvailableDriver = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const driver = await findAvailableDriver(latitude, longitude);

    if (!driver) {
      return res.status(404).json({ message: "No available drivers" });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update driver availability
const updateDriverStatus = async (req, res) => {
  try {
    const { driverId, isAvailable } = req.body;
    const updatedDriver = await updateDriverAvailability(driverId, isAvailable);

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({ message: "Driver status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAvailableDriver, updateDriverStatus, updateLocation };
