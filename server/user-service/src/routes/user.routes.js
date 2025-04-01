const express = require("express");

const { getAllUsers, getAllRestaurants, getAllDeliveryPersons, getAllCustomers } = require("../controllers/user.controller.js");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware.js");

const userRouter = express.Router();

userRouter.get("/",verifyToken, isAdmin, getAllUsers);
userRouter.get("/customers", verifyToken, isAdmin, getAllCustomers);
userRouter.get("/delivery-persons", verifyToken, isAdmin, getAllDeliveryPersons);
userRouter.get("/restaurants", getAllRestaurants);

module.exports = userRouter;
