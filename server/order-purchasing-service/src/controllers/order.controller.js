const OrderService = require("../services/order.service.js");

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const { restaurantId, products, shippingAddress } = req.body;

    const order = await OrderService.createOrder(
      userId,
      restaurantId,
      products,
      shippingAddress
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
    const userId = req.user.id;
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await OrderService.updateOrderStatus(
      userId,
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
    const { orderId } = req.params;

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

module.exports = {
  createOrder,
  getRestaurantOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
