const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const Driver = require("../models/driver.model.js");
const { JWT_SECRET } = require("../config/env.js");

const registerUser = async (userData) => {
  const { email, password, role } = userData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("User with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Validate required fields based on role
  switch (role) {
    case "customer":
      if (!userData.firstName || !userData.lastName || !userData.phone) {
        throw new Error(
          "Customer registration requires firstName, lastName, and phone"
        );
      }
      break;

    case "restaurant-admin":
      if (!userData.restaurantName || !userData.licenseNumber) {
        throw new Error(
          "Restaurant owner registration requires restaurantName and licenseNumber"
        );
      }
      break;

    case "delivery-person":
      if (!userData.vehicleType || !userData.vehicleNumber || !userData.licenseNumber) {
        throw new Error(
          "Delivery Person registration requires vehicleType, vehicleNumber and licenseNumber"
        );
      }
      break;

    default:
      throw new Error("Invalid user role specified");
  }

  // Create base user object
  const userDataToSave = {
    email,
    password: hashedPassword,
    role,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone
  };

  // Add role-specific fields
  if (role === "restaurant-admin") {
    userDataToSave.restaurantName = userData.restaurantName;
    userDataToSave.licenseNumber = userData.licenseNumber;
    userDataToSave.isApproved = false; // New restaurants need approval
  }

  // Create and save user
  const user = new User(userDataToSave);
  await user.save();

  let driver = null;
  
  // If role is delivery-person, create driver profile
  if (role === "delivery-person") {
    driver = new Driver({
      userId: user._id,
      vehicleType: userData.vehicleType,
      vehicleNumber: userData.vehicleNumber,
      licenseNumber: userData.licenseNumber,
      documents: userData.documents || []
    });

    await driver.save();
    
    // Update user with driver reference
    user.driverProfile = driver._id;
    await user.save();
  }

  return { 
    success: true, 
    message: "User registered successfully",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      ...(role === 'delivery-person' && { 
        driverProfile: {
          id: driver._id,
          vehicleType: driver.vehicleType,
          vehicleNumber: driver.vehicleNumber
        }
      })
    }
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).populate({
    path: 'driverProfile',
    model: 'Driver'
  });

  if (!user) {
    const error = new Error("No account found with this email. Please sign up");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("The password you entered is incorrect");
    error.statusCode = 401;
    throw error;
  }

  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      driverId: user.role === 'delivery-person' ? user.driverProfile?._id : null
    }, 
    JWT_SECRET, 
    { expiresIn: "1h" }
  );

  return { 
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      driverProfile: user.role === 'delivery-person' ? user.driverProfile : null
    }
  };
};

module.exports = { registerUser, loginUser };