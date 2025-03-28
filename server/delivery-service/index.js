const express = require('express');
const mongoose = require('mongoose');
const { PORT } = require("./src/config/env.js");
const { startDeliveryConsumer } = require('./src/consumers/delivery.consumer.js');

const connectToDatabase = require("./src/config/mongodb.js");

const deliverRoutes = require("./src/routes/deliver.routes.js");
const { connectRabbitMQ } = require('./lib/rabbitmq.js');

const app = express();
app.use(express.json());

app.use("/api/v1/deliveries", deliverRoutes);

connectRabbitMQ();

app.listen(PORT, async () => {
  console.log(`Order service running on port ${PORT}`);
  await connectToDatabase();
  await startDeliveryConsumer(); 
});