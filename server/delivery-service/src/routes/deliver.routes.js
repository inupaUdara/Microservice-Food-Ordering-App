const express = require('express');
const { assignDriver } = require('../services/deliver.service.js');

const router = express.Router();

// Manual test endpoint for delivery assignment
router.post('/assign', async (req, res) => {
  const delivery = await assignDriver(req.body);
  if (!delivery) return res.status(400).json({ message: 'No available driver' });

  res.status(201).json(delivery);
});

module.exports = router;