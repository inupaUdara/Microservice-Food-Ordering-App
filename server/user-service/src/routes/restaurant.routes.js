const express = require("express");
const { approveOfRestaurant, getRestaurantById, getBatchRestaurants } = require("../controllers/restaurant.controller.js");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.put("/approve/:id", verifyToken, isAdmin, approveOfRestaurant);
router.get("/:id", getRestaurantById);
router.post(
    '/batch',
    getBatchRestaurants
  );

module.exports = router;