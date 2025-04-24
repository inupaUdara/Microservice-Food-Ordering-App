const express = require('express');
const { confirmOrder } = require('../controllers/confirmation.controller');
const router = express.Router();

router.post('/confirm', confirmOrder);

module.exports = router;
