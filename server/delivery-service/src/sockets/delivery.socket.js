const DeliveryController = require("../controllers/delivery.controller");

function setupDeliverySocket(io) {
  io.on("connection", (socket) => {
    console.log(`📡 Client connected: ${socket.id}`);

    socket.on("joinDeliveryRoom", (deliveryId) => {
      socket.join(`delivery-${deliveryId}`);
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
}

module.exports = setupDeliverySocket;