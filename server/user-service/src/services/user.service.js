const Driver = require("../models/driver.model");
const Restaurant = require("../models/restaurant.model");
const User = require("../models/user.model");

const getAllUsers = async (filter = {}) => {
  const users = await User.find(filter)
    .select("-password") 
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
        .populate("restaurantProfile")
        .sort({ createdAt: -1 });
    
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
  const filter = {}; 

  // Apply filter only if isApproved is explicitly passed
  if (typeof isApproved === "boolean") {
    filter.isApproved = isApproved;
  }

  const restaurants = await Restaurant.find(filter).populate(
    "userId",
    "email firstName lastName phone"
  ).sort({ createdAt: -1 });

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


const getUserStats = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, today, thisWeek, thisMonth, roleStats] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: startOfDay } }),
    User.countDocuments({ createdAt: { $gte: startOfWeek } }),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const roles = {};
  roleStats.forEach(r => {
    roles[r._id] = r.count;
  });

  return {
    totalUsers: total,
    newUsersToday: today,
    newUsersThisWeek: thisWeek,
    newUsersThisMonth: thisMonth,
    usersByRole: roles
  };
};

module.exports = { getAllUsers, getAllRestaurants, getAllDeliveryPersons, getAllCustomers, getUserById, deleteUser, getUserStats };