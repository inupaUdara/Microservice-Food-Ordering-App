const { default: axios } = require("axios");
const OrderService = require("../services/order.service.js");

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const {
      restaurantId,
      products,
      shippingAddress,
      paymentId,
      totalAmount,
      deliveryFee,
      grandTotal,
      customerEmail,
      customerPhone,
      customerName,
    } = req.body;

    const order = await OrderService.createOrder(
      userId,
      restaurantId,
      products,
      shippingAddress,
      paymentId,
      totalAmount,
      grandTotal,
      deliveryFee,
      customerEmail,
      customerPhone,
      customerName
    );
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getRestaurantOrders = async (req, res, next) => {
  try {
    const restaurantId = req.user.restaurantId;

    const role = req.user.role;

    const orders = await OrderService.getRestaurantOrders(restaurantId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await OrderService.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await OrderService.getOrderById(userId, orderId);
    if (!order) {
      const error = new Error("Order is not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const orderId = req.params.orderId;
    const { status } = req.body;

    const updatedOrder = await OrderService.updateOrderStatus(
      // userId,
      orderId,
      status
    );

    if (!updatedOrder) {
      const error = new Error("Order is not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    const cancelledOrder = await OrderService.cancelOrder(userId, orderId);
    if (!cancelledOrder) {
      const error = new Error(
        "Order cannot be cancelled after out for delivery or delivered"
      );
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json(cancelledOrder);
  } catch (error) {
    next(error);
  }
};

const getGeoCode = async (req, res, next) => {
  try {
    const { address } = req.query;
    console.log("address", address);
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

const getOutForDeliveryStats = async (req, res, next) => {
  try {
    const restaurantId = req.user.restaurantId;
    const stats = await OrderService.getOutForDeliveryStats(restaurantId);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

const getItemsSoldByRestaurant = async (req, res, next) => {
  try {
    const restaurantId = req.user.restaurantId;
    const itemsSold = await OrderService.getItemsSoldByRestaurant(restaurantId);
    res.status(200).json(itemsSold);
  } catch (error) {
    next(error);
  }
};

const fetchOrderStats = async (req, res) => {
  try {
    const stats = await OrderService.getOrderStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({ message: "Failed to fetch order statistics" });
  }
};

module.exports = {
  createOrder,
  getRestaurantOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getGeoCode,
  getOutForDeliveryStats,
  getItemsSoldByRestaurant,
  fetchOrderStats,
};
