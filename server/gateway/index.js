const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Microservice Endpoints
const USER_SERVICE = process.env.USER_SERVICE_URL || "http://user-service:3001";
const ORDER_SERVICE =
  process.env.ORDER_SERVICE_URL || "http://order-purchasing-service:3002";
const RESTURANT_MENU_SERVICE =
  process.env.RESTURANT_MENU_SERVICE_URL ||
  "http://resturant-menu-service:5000";
const DELIVERY_SERVICE = process.env.DELIVERY_SERVICE_URL || "http://delivery-service:3003";

// Proxy Requests to Microservices
app.use("/users", proxy(USER_SERVICE));
app.use("/orders", proxy(ORDER_SERVICE));
app.use("/resturant-menus", proxy(RESTURANT_MENU_SERVICE));
app.use("/deliveries", proxy(DELIVERY_SERVICE));

app.get("/", (req, res) =>
  res.json({ message: "API Gateway Running with express-http-proxy" })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
