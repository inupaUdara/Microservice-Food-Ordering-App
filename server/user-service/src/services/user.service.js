const Driver = require("../models/driver.model");
const Restaurant = require("../models/restaurant.model");
const User = require("../models/user.model");

const getAllUsers = async (filter = {}) => {
  const users = await User.find(filter)
    .select("-password") // Exclude passwords
    .populate("driverProfile")
    .populate("restaurantProfile");

  return users.map((user) => ({
    id: user._id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    driverProfile: user.role === "delivery-person" ? user.driverProfile : null,
    restaurantProfile:
      user.role === "restaurant-admin" ? user.restaurantProfile : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
};

const getAllRestaurants = async () => {
  const restaurants = await Restaurant.find({}).populate(
    "userId",
    "email firstName lastName phone"
  );

  return restaurants.map((restaurant) => ({
    id: restaurant._id,
    restaurantName: restaurant.restaurantName,
    licenseNumber: restaurant.licenseNumber,
    restaurantPhone: restaurant.restaruantPhone,
    restaurantAddress: restaurant.restaruantAddress,
    location: restaurant.location,
    openingHours: restaurant.openingHours,
    isApproved: restaurant.isApproved,
    owner: restaurant.userId, // Restaurant owner's details
    createdAt: restaurant.createdAt,
    updatedAt: restaurant.updatedAt,
  }));
};

const getAllDeliveryPersons = async () => {
  const deliveryPersons = await Driver.find({}).populate(
    "userId",
    "email firstName lastName phone"
  );

  return deliveryPersons.map((driver) => ({
    id: driver._id,
    vehicleType: driver.vehicleType,
    vehicleNumber: driver.vehicleNumber,
    licenseNumber: driver.licenseNumber,
    documents: driver.documents,
    owner: driver.userId, // Delivery person's details
    createdAt: driver.createdAt,
    updatedAt: driver.updatedAt,
  }));
};

module.exports = { getAllUsers, getAllRestaurants, getAllDeliveryPersons };
