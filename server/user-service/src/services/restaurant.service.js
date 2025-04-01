const Restaurant = require("../models/restaurant.model.js");

const approveRestaurant = async (restaurantId, isApproved) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  restaurant.isApproved = isApproved;
  await restaurant.save();

  return {
    success: true,
    message: `Restaurant ${isApproved ? "approved" : "rejected"} successfully`,
    restaurant,
  };
};

const getRestaurantById = async (restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId).populate(
    "userId",
    "email firstName lastName phone"
  );

  if (!restaurant) {
    const error = new Error("Restaurant not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: restaurant._id,
    restaurantName: restaurant.restaurantName,
    licenseNumber: restaurant.licenseNumber,
    restaurantPhone: restaurant.restaurantPhone,
    restaurantAddress: restaurant.restaurantAddress,
    location: restaurant.location,
    openingHours: restaurant.openingHours,
    logo: restaurant.logo,
    rating: restaurant.rating,
    isApproved: restaurant.isApproved,
    owner: restaurant.userId, // Restaurant owner's details
    createdAt: restaurant.createdAt,
    updatedAt: restaurant.updatedAt,
  };
};


module.exports = { approveRestaurant, getRestaurantById };