const express = require("express");
const { createOrder, getOrderById, getUserOrders, updateOrderStatus, cancelOrder } = require("../controllers/order.controller.js");
const authenticateToken = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/my-orders", authenticateToken, getUserOrders);
router.get("/:orderId", authenticateToken, getOrderById);
router.patch("/:orderId/status", authenticateToken, updateOrderStatus);
router.delete("/:orderId", authenticateToken, cancelOrder);

module.exports = router;