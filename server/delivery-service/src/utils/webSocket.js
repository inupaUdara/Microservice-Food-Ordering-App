const { Server } = require('socket.io');
const DeliveryController = require("../controllers/delivery.controller");

function initWebSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    // Client subscribes to a delivery
    socket.on('subscribeDelivery', (deliveryId) => {
      socket.join(deliveryId);
    });

    socket.on("driverLocationUpdate", async ({ deliveryId, location }) => {
          try {
            const updated = await DeliveryController.updateLocation(deliveryId, location);
            io.to(`delivery-${deliveryId}`).emit("locationUpdate", {
              deliveryId,
              location: updated.currentLocation,
            });
          } catch (err) {
            socket.emit("error", err.message);
          }
        });
    
        socket.on("disconnect", () => {
          console.log(`❌ Client disconnected: ${socket.id}`);
        });
  });

  return io;
}

module.exports = initWebSocket;
