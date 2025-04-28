const express = require('express');
const { confirmOrder, confirmRegistration, confirmOrderCompletion } = require('../controllers/confirmation.controller');
const router = express.Router();

router.post('/confirm', confirmOrder);
router.post('/complete', confirmOrderCompletion);
router.post('/register', confirmRegistration);

module.exports = router;
