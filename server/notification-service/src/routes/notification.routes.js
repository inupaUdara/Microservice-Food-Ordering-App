const express = require('express');
const { confirmOrder, confirmRegistration, confirmOrderCompletion, cancelOrder } = require('../controllers/confirmation.controller');
const router = express.Router();

router.post('/confirm', confirmOrder);
router.post('/complete', confirmOrderCompletion);
router.post('/register', confirmRegistration);
router.post('/cancel', cancelOrder);

module.exports = router;
