const userService = require("../services/user.service.js");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, users });
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
    const restaurants = await userService.getAllRestaurants();
    res.status(200).json({ success: true, restaurants });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getAllRestaurants, getAllDeliveryPersons };
