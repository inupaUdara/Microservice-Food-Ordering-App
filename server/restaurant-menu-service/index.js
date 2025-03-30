const express = require("express");
const { PORT } = require("./src/config/env.js");

const connectToDatabase = require("./src/config/mongodb.js");

const menuRoutes = require("./src/routes/restaurant-menu.routes.js");

const app = express();
app.use(express.json());

app.use("/api/v1/menu", menuRoutes);

app.listen(PORT, async () => {
  console.log(`Restaurant Menu service running on port ${PORT}`);
  await connectToDatabase();
});
