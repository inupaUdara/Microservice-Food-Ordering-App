const express = require("express");

const { signIn, signUp, getProfile, updateProfile, forgotPassword, resetPassword } = require("../controllers/auth.controller.js");
const { verifyToken } = require("../middlewares/auth.middleware.js");

const authRouter = express.Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.get("/me", verifyToken, getProfile);
authRouter.put("/profile", verifyToken, updateProfile);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

module.exports = authRouter;
