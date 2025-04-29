const deliveryService = require("../services/deliver.service.js");

const assignDriverToOrder = async (req, res, next) => {
  try {
    const delivery = await deliveryService.assignDriver(req.body);
    if (!delivery) {
      return res.status(400).json({ message: "No available driverr" });
    }
    res.status(201).json(delivery);
  } catch (error) {
    next(error);
  }
};

// Update delivery status
const updateDeliveryStatus = async (req, res, next) => {
    try {
      const { deliveryId } = req.params;
      const { status, location } = req.body;
      const updatedDelivery = await deliveryService.updateStatus(deliveryId, status, location);
      res.status(200).json(updatedDelivery);
    } catch (error) {
      next(error);
    }
  };
   
  // Track a delivery (authorized user only)
  const trackDelivery = async (req, res, next) => {
    try {
      const { deliveryId } = req.params;
      const user = req.user; // Assume middleware injects user
      const trackingData = await deliveryService.trackDelivery(deliveryId, user);
      res.status(200).json(trackingData);
    } catch (error) {
      next(error);
    }
  };
  
  // Get delivery by ID
  const getDeliveryById = async (req, res, next) => {
    try {
      const { deliveryId } = req.params;
      const delivery = await deliveryService.getDeliveryById(deliveryId);
      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  };
  
  // Get all deliveries (admin only)
  const getAllDeliveries = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const deliveries = await deliveryService.getAllDeliveries(+page, +limit);
      res.status(200).json(deliveries);
    } catch (error) {
      next(error);
    }
  };
  
  // Get deliveries by user (customer)
  const getDeliveriesByUserId = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const { page = 1, limit = 10 } = req.query;
      const deliveries = await deliveryService.getDeliveriesByUserId(userId, +page, +limit);
      res.status(200).json(deliveries);
    } catch (error) {
      next(error);
    }
  };
  
  // Get deliveries by driver
  const getDeliveriesByDriverId = async (req, res, next) => {
    try {
      const driverId = req.params.driverId;
      const { page = 1, limit = 10 } = req.query;
      const deliveries = await deliveryService.getDeliveriesByDriverId(driverId, +page, +limit);
      res.status(200).json(deliveries[0]);
    } catch (error) {
      next(error);
    }
  };
  
  // Update delivery location (e.g. via WebSocket or periodic ping)
  const updateLocation = async (req, res, next) => {
    try {
      const { deliveryId } = req.params;
      const { location } = req.body;
      const updated = await deliveryService.updateDeliveryLocation(deliveryId, location);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

  const getDeliveryByOrderId = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const delivery = await deliveryService.getDeliveryByOrderId(orderId);
      res.status(200).json(delivery);
    } catch (error) {
      next(error);
    }
  };

module.exports = {
    assignDriverToOrder,
    updateDeliveryStatus,
    trackDelivery,
    getDeliveryById,
    getAllDeliveries,
    getDeliveriesByUserId,
    getDeliveriesByDriverId,
    updateLocation,
    getDeliveryByOrderId
};
