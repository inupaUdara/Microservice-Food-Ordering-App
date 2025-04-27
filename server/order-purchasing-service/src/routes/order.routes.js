const express = require("express");
const { createOrder, getOrderById, getUserOrders, updateOrderStatus, cancelOrder, getRestaurantOrders, getGeoCode } = require("../controllers/order.controller.js");
const {authenticateToken, authorizeRoles, authenticateInternalService} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/my-orders", authenticateToken, getUserOrders);
router.get("/restaurant",authenticateToken, authorizeRoles("restaurant-admin"), getRestaurantOrders);
router.get("/geocode",authenticateToken, getGeoCode);
router.get("/:orderId", authenticateToken, getOrderById);
router.patch("/:orderId", authenticateToken, updateOrderStatus);
router.delete("/:orderId", authenticateToken, cancelOrder);

module.exports = router;