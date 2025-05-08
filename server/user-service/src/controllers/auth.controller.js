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

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await authService.updateUserProfile(userId, req.body);
    res.status(200).json({ success: true, user: result });
  } catch (error) {
    next(error);
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.sendPasswordResetEmail(email);
    res.status(200).json({ 
      success: true, 
      message: 'Password reset email sent successfully' 
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, signIn, getProfile, updateProfile, forgotPassword, resetPassword };