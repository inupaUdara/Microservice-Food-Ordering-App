const express = require("express");

const { signIn, signUp } = require("../controllers/auth.controller.js");

const authRouter = express.Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);

module.exports = authRouter;