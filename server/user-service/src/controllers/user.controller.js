const userService = require("../services/user.service.js");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await userService.getAllCustomers();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    next(error);
  }
};

const getAllDeliveryPersons = async (req, res, next) => {
  try {
    const deliveryPersons = await userService.getAllDeliveryPersons();
    res.status(200).json({ success: true, deliveryPersons });
  } catch (error) {
    next(error);
  }
};

const getAllRestaurants = async (req, res, next) => {
  try {
    const isApproved = req.query.isApproved === "true";
    const restaurants = await userService.getAllRestaurants(isApproved);
    res.status(200).json({ success: true, restaurants });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getAllRestaurants, getAllDeliveryPersons, getAllCustomers };
