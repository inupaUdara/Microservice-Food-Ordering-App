const express = require('express');
const cookieParser = require("cookie-parser");
const { PORT } = require('./src/config/env.js');

const connectToDatabase = require("./src/config/mongodb.js");
const errorMiddleware = require("./src/middlewares/error.middleware.js");

const authRouter = require("./src/routes/auth.routes.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`User service is running on port ${PORT}`);
  await connectToDatabase();
});