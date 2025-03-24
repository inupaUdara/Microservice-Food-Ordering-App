const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Microservice Endpoints
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://user-service:3001";
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || "http://order-purchasing-service:3002";

// Proxy Requests to Microservices
app.use("/users", proxy(AUTH_SERVICE));
app.use("/orders", proxy(ORDER_SERVICE));

app.get("/", (req, res) => res.json({ message: "API Gateway Running with express-http-proxy" }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));