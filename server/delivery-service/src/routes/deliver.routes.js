const express = require('express');
const { assignDriverToOrder, updateDeliveryStatus, trackDelivery, getDeliveryById, getAllDeliveries, getDeliveriesByUserId, getDeliveriesByDriverId, getDeliveryByOrderId } = require('../controllers/delivery.controller');
const {authenticateToken, authorizeRoles} = require('../middlewares/auth.middleware');
const { updateDeliveryLocation } = require('../services/deliver.service');


const router = express.Router();

router.post('/assign', authenticateToken, assignDriverToOrder);
router.patch('/:deliveryId/status',authenticateToken, updateDeliveryStatus);
router.get('/:deliveryId/track',authenticateToken, trackDelivery);
router.get('/:deliveryId',authenticateToken, getDeliveryById);
router.get('/',authenticateToken, getAllDeliveries);
router.get('/user/:userId',authenticateToken, getDeliveriesByUserId);
router.get('/driver/:driverId',authenticateToken, getDeliveriesByDriverId);
router.patch('/:deliveryId/location',authenticateToken, updateDeliveryLocation);
router.get('/order/:orderId',authenticateToken, getDeliveryByOrderId);

module.exports = router;
