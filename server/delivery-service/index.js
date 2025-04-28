const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { PORT } = require("./src/config/env.js");
const initWebSocket = require('./src/utils/webSocket.js');
const { startDeliveryConsumer } = require('./src/consumers/delivery.consumer.js');
const connectToDatabase = require("./src/config/mongodb.js");
const deliverRoutes = require("./src/routes/deliver.routes.js");
const { connectRabbitMQ } = require('./lib/rabbitmq.js');
const errorMiddleware = require('./src/middlewares/error.middleware.js');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
const io = initWebSocket(server);

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/deliveries", deliverRoutes);

app.use(errorMiddleware);

// Database and Message Broker Connections
async function initializeServices() {
  try {
    await connectToDatabase();
    // await connectRabbitMQ();
    // await startDeliveryConsumer();
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Start server
server.listen(PORT, async () => {
  console.log(`Delivery service running on port ${PORT}`);
  await initializeServices();
});

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
