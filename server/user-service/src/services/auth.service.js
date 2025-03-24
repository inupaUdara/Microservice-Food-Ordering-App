const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const { JWT_SECRET } = require("../config/env.js");

const registerUser = async (userData) => {
  const { email, password, role } = userData;

  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("User with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (role === "customer") {
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.phone ||
      !userData.address
    ) {
      throw new Error(
        "Customer registration requires firstName, lastName, phone, and address"
      );
    }
  } else if (role === "restaurant-admin") {
    if (!userData.restaurantName || !userData.licenseNumber) {
      throw new Error(
        "Restaurant Admin registration requires restaurantName and licenseNumber"
      );
    }
    userData.isApproved = false;
  } else if (role === "delivery-person") {
    if (!userData.vehicleType || !userData.vehicleNumber) {
      throw new Error(
        "Delivery Person registration requires vehicleType and vehicleNumber"
      );
    }
  }

  const user = new User({ ...userData, password: hashedPassword, role });

  await user.save();

  return { success: true, message: "User registered successfully" };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

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

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token };
};

module.exports = { registerUser, loginUser };
