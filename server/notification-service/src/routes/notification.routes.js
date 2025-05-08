const express = require('express');
const { confirmOrder, confirmRegistration, confirmOrderCompletion, cancelOrder, confirmRestaurantRegistration, resetPasswordToken } = require('../controllers/confirmation.controller');
const router = express.Router();

router.post('/confirm', confirmOrder);
router.post('/complete', confirmOrderCompletion);
router.post('/register', confirmRegistration);
router.post('/reset-password', resetPasswordToken);
router.post('/cancel', cancelOrder);
router.post('/register-restaurant', confirmRestaurantRegistration);

module.exports = router;
