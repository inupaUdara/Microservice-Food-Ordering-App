const express = require('express');
const { getAvailableDriver, updateDriverStatus, updateLocation } = require('../controllers/driver.controller.js');

const router = express.Router();

router.put("/update-location", updateLocation);
router.get('/available', getAvailableDriver);
router.put('/update-status', updateDriverStatus);

module.exports = router;