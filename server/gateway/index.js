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
const DELIVERY_SERVICE =
  process.env.DELIVERY_SERVICE_URL || "http://delivery-service:3003";
const RESTAURANT_MENU_SERVICE =
  process.env.RESTAURANT_MENU_SERVICE_URL ||
  "http://restaurant-menu-service:3004";
const NOTIFICATION_SERVICE =
  process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:5001";
const PAYMENT_SERVICE =
  process.env.PAYMENT_SERVICE_URL || "http://payment-service:5002";

// Proxy Requests to Microservices
app.use("/users", proxy(USER_SERVICE));
app.use("/orders", proxy(ORDER_SERVICE));
app.use("/deliveries", proxy(DELIVERY_SERVICE));
app.use("/menu", proxy(RESTAURANT_MENU_SERVICE));
app.use("/notifications-service", proxy(NOTIFICATION_SERVICE));
app.use("/payments-service", proxy(PAYMENT_SERVICE));

app.get("/", (req, res) =>
  res.json({ message: "API Gateway Running with express-http-proxy" })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
