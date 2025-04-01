const express = require("express");

const { signIn, signUp, getProfile } = require("../controllers/auth.controller.js");
const { verifyToken } = require("../middlewares/auth.middleware.js");

const authRouter = express.Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.get("/me", verifyToken, getProfile);

module.exports = authRouter;
