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

const getAllCustomers = async () => {
    const customers = await User.find({ role: "customer" })
        .select("-password") // Exclude passwords
        .populate("driverProfile")
        .populate("restaurantProfile");
    
    return customers.map((user) => ({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }));
}

const getAllRestaurants = async (isApproved) => {
  const filter = {}; // Default filter

  // Apply filter only if isApproved is explicitly passed
  if (typeof isApproved === "boolean") {
    filter.isApproved = isApproved;
  }

  const restaurants = await Restaurant.find(filter).populate(
    "userId",
    "email firstName lastName phone"
  );

  return restaurants.map((restaurant) => ({
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
    owner: restaurant.userId, 
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
    owner: driver.userId, 
    createdAt: driver.createdAt,
    updatedAt: driver.updatedAt,
  }));
};

const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select("-password") // Exclude passwords
    .populate("driverProfile")
    .populate("restaurantProfile");

  if (!user) {
    throw new Error("User not found");
  }

  return {
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
  };
}

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // If the user is a restaurant-admin, delete the associated restaurant
  if (user.role === "restaurant-admin") {
    await Restaurant.findOneAndDelete({
      userId: user._id,
    });
  }
  // If the user is a delivery-person, delete the associated driver profile
  if (user.role === "delivery-person") {
    await Driver.findOneAndDelete({
      userId: user._id,
    });
  }
 
  return { message: "User deleted successfully" };
};

module.exports = { getAllUsers, getAllRestaurants, getAllDeliveryPersons, getAllCustomers, getUserById, deleteUser };
