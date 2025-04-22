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
    openingHours: restaurant.openingHours,
    logo: restaurant.logo,
    rating: restaurant.rating,
    isApproved: restaurant.isApproved,
    owner: restaurant.userId, // Restaurant owner's details
    createdAt: restaurant.createdAt,
    updatedAt: restaurant.updatedAt,
  };
};

const getBatchRestaurants = async (ids) => {
  if (!ids || !Array.isArray(ids)) {
    throw new Error('Array of restaurant IDs is required');
  }

  // Fetch restaurants directly using Mongoose model
  const restaurants = await Restaurant.find(
    { _id: { $in: ids } },
    'restaurantName logo restaurantAddress restaurantPhone rating'
  ).lean();

  // Transform data
  return restaurants.map(r => ({
    id: r._id,
    restaurantName: r.restaurantName,
    logo: r.logo,
    restaurantAddress: r.restaurantAddress,
    restaurantPhone: r.restaurantPhone,
    rating: r.rating
  }));
};


module.exports = { approveRestaurant, getRestaurantById, getBatchRestaurants };