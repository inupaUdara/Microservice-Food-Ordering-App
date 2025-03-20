const Order = require("../models/order.model.js");

const createOrder = async (userId, products, shippingAddress) => {
  const totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  
  const order = new Order({ userId, products, totalAmount, shippingAddress });
  return await order.save();
};

const getUserOrders = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};

const getOrderById = async (userId, orderId) => {
  return await Order.findOne({ _id: orderId, userId });
};

const updateOrderStatus = async (userId, orderId, status) => {
  return await Order.findOneAndUpdate(
    { _id: orderId, userId },
    { status, updatedAt: Date.now() },
    { new: true }
  );
};

const cancelOrder = async (userId, orderId) => {
  return await Order.findOneAndUpdate(
    { _id: orderId, userId, status: { $nin: ["shipped", "delivered"] } },
    { status: "cancelled", updatedAt: Date.now() },
    { new: true }
  );
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
}