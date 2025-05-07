const express = require("express");


const {authenticateToken, authorizeRoles } = require("../middlewares/auth.middleware.js");
const {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  getRestaurantOrders,
  getGeoCode,
  getOutForDeliveryStats,
} = require("../controllers/order.controller.js");


const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/my-orders", authenticateToken, getUserOrders);
router.get(
  "/restaurant",
  authenticateToken,
  authorizeRoles("restaurant-admin"),
  getRestaurantOrders
);
router.get("/geocode", authenticateToken, getGeoCode);
router.get("/:orderId", authenticateToken, getOrderById);
router.patch("/:orderId", updateOrderStatus);
router.delete("/:orderId", authenticateToken, cancelOrder);
router.get(
  "/restaurant/stats/out-for-delivery",
  authenticateToken,
  authorizeRoles("restaurant-admin"),
  getOutForDeliveryStats
);

module.exports = router;
