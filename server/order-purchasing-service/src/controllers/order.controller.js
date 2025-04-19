const OrderService = require("../services/order.service.js");

const createOrder = async (req, res) => {
  try {
    const { userId } = req.user; 
    const { products, shippingAddress } = req.body;

    const order = await OrderService.createOrder(
      userId,
      products,
      shippingAddress
    );
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.user;
    const orders = await OrderService.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { orderId } = req.params;

    const order = await OrderService.getOrderById(userId, orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { userId } = req.user;
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await OrderService.updateOrderStatus(
      userId,
      orderId,
      status
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { orderId } = req.params;

    const cancelledOrder = await OrderService.cancelOrder(userId, orderId);
    if (!cancelledOrder) {
      return res.status(400).json({
        message: "Order cannot be cancelled after shipping",
      });
    }

    res.status(200).json(cancelledOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports =  {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
}
