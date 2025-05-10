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

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await userService.deleteUser(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

const getUserStatistics = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error getting user statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllUsers, getAllRestaurants, getAllDeliveryPersons, getAllCustomers, getUserById, deleteUser, getUserStatistics };