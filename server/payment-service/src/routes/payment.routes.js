const express = require('express');
const { createPayment } = require('../controllers/payment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');


const router = express.Router();


// router.post('/create-payment',authenticateToken, createPayment);
router.post('/create-payment', createPayment);



module.exports = router;
