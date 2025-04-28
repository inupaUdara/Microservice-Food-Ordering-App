const express = require('express');
const { confirmOrder, confirmRegistration } = require('../controllers/confirmation.controller');
const router = express.Router();

router.post('/confirm', confirmOrder);
router.post('/register', confirmRegistration);

module.exports = router;
