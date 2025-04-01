const authService = require("../services/auth.service.js");

const signUp = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await authService.getUserProfile(userId);
    res.status(200).json({ success: true, user: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { signUp, signIn, getProfile };