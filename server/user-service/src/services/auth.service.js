const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const User = require("../models/user.model.js");
const Driver = require("../models/driver.model.js");
const Restaurant = require("../models/restaurant.model.js");
const { JWT_SECRET } = require("../config/env.js");
const { confirmRegistration, resetPasswordEmail } = require("./notification.service.js");

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
      if (
        !userData.vehicleType ||
        !userData.vehicleNumber ||
        !userData.licenseNumber
      ) {
        throw new Error(
          "Delivery Person registration requires vehicleType, vehicleNumber and licenseNumber"
        );
      }
      break;
    case "admin":
      // Admin registration can be empty or have specific fields
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
    phone: userData.phone,
  };

  // Add role-specific fields
  if (role === "restaurant-admin") {
    userDataToSave.restaurantName = userData.restaurantName;
    userDataToSave.licenseNumber = userData.licenseNumber;
    userDataToSave.isApproved = false; // New restaurants need approval
  }

  const user = new User(userDataToSave);
  // Create and save user
  if (role === "customer") {
    await user.save();
    try {
      await confirmRegistration(user.email, "+94764874911", user.firstName);
      console.log("Registration confirmation notification sent successfully.");
    } catch (err) {
      console.error("Failed to send order confirmation:", err.message);
      // Optional: decide if you want to continue even if notification fails
    }
  }

  let driver = null;

  // If role is delivery-person, create driver profile
  if (role === "delivery-person") {
    driver = new Driver({
      userId: user._id,
      vehicleType: userData.vehicleType,
      vehicleNumber: userData.vehicleNumber,
      licenseNumber: userData.licenseNumber,
      documents: userData.documents || [],
    });

    await driver.save();

    // Update user with driver reference
    user.driverProfile = driver._id;
    await user.save();
  }

  // If role is restaurant-admin, create a restaurant profile
  if (role === "restaurant-admin") {
    restaurant = new Restaurant({
      userId: user._id,
      restaurantName: userData.restaurantName,
      licenseNumber: userData.licenseNumber,
      restaurantPhone: userData.restaurantPhone,
      restaurantAddress: userData.restaurantAddress,
      openingHours: userData.openingHours,
      isApproved: false, // Admin needs to approve the restaurant
    });

    await restaurant.save();

    // Update user with restaurant reference
    user.restaurantProfile = restaurant._id;
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
      ...(role === "delivery-person" && {
        driverProfile: {
          id: driver._id,
          vehicleType: driver.vehicleType,
          vehicleNumber: driver.vehicleNumber,
        },
      }),
      ...(role === "restaurant-admin" && {
        restaurantProfile: {
          id: restaurant._id,
          name: restaurant.restaurantName,
          restaruantPhone: userData.restaruantPhone,
          restaruantAddress: userData.restaruantAddress,
          openingHours: userData.openingHours,
          isApproved: restaurant.isApproved,
        },
      }),
    },
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email })
    .populate({
      path: "driverProfile",
      model: "Driver",
    })
    .populate({
      path: "restaurantProfile",
      model: "Restaurant",
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
      driverId:
        user.role === "delivery-person" ? user.driverProfile?._id : null,
      restaurantId:
        user.role === "restaurant-admin" ? user.restaurantProfile?._id : null,
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
      phone: user.phone,
      driverProfile:
        user.role === "delivery-person" ? user.driverProfile : null,
      restaurantProfile:
        user.role === "restaurant-admin" ? user.restaurantProfile : null,
    },
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select("-password") // Exclude password from response
    .populate({
      path: "driverProfile",
      model: "Driver",
    })
    .populate({
      path: "restaurantProfile",
      model: "Restaurant",
    });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
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
};

const updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update common user fields
    const userUpdates = {};
    const allowedUserFields = ['firstName', 'lastName', 'phone', 'address'];
    allowedUserFields.forEach(field => {
      if (updateData[field] !== undefined) {
        userUpdates[field] = updateData[field];
      }
    });

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(userId, userUpdates, { new: true, runValidators: true });
    }

    // Update role-specific profiles
    let profileUpdate;
    switch (user.role) {
      case 'delivery-person':
        profileUpdate = await updateDriverProfile(userId, updateData);
        break;
      case 'restaurant-admin':
        profileUpdate = await updateRestaurantProfile(userId, updateData);
        break;
    }

    // Get updated user with populated profile
    const updatedUser = await User.findById(userId)
      .populate({
        path: 'driverProfile',
        select: '-documents -activeOrders -__v'
      })
      .populate({
        path: 'restaurantProfile',
        select: '-__v -createdAt'
      })
      .select('-password -__v');

    return updatedUser;
    
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateDriverProfile = async (userId, updateData) => {
  const driver = await Driver.findOne({ userId });
  if (!driver) {
    throw new Error('Driver profile not found');
  }

  const allowedFields = ['vehicleType', 'vehicleNumber', 'licenseNumber', 'currentLocation'];
  const driverUpdates = {};
  
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      driverUpdates[field] = updateData[field];
    }
  });

  return Driver.findByIdAndUpdate(driver._id, driverUpdates, { new: true, runValidators: true });
};

const updateRestaurantProfile = async (userId, updateData) => {
  const restaurant = await Restaurant.findOne({ userId });
  if (!restaurant) {
    throw new Error('Restaurant profile not found');
  }

  const allowedFields = [
    'restaurantName', 'restaurantPhone', 'restaurantAddress', 'openingHours', 'logo'
  ];
  const restaurantUpdates = {};

  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      restaurantUpdates[field] = updateData[field];
    }
  });

  return Restaurant.findByIdAndUpdate(
    restaurant._id,
    restaurantUpdates,
    { new: true, runValidators: true }
  );
};

const generateResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("No account found with this email");
    error.statusCode = 404;
    throw error;
  }

  // Generate token
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  const resetTokenExpires = Date.now() + 3600000; // 1 hour from now

  // Save token to user
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetTokenExpires;
  await user.save();

  return resetToken;
};

const sendPasswordResetEmail = async (email) => {
  try {
    const resetToken = await generateResetToken(email);
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // const emailOptions = {
    //   to: email,
    //   subject: 'Password Reset Request',
    //   template: 'password-reset',
    //   context: {
    //     resetUrl,
    //     expiryTime: '1 hour'
    //   }
    // };

    await resetPasswordEmail(email, resetToken);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    const error = new Error("Password reset token is invalid or has expired");
    error.statusCode = 400;
    throw error;
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear reset token
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { success: true, message: 'Password has been reset successfully' };
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, updateDriverProfile, updateRestaurantProfile, resetPassword, sendPasswordResetEmail };
