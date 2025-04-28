const axios = require("axios");
const Delivery = require("../models/delivery.model.js");
const { getChannel } = require("../../lib/rabbitmq.js");
const {
  calculateEstimatedTime,
} = require("../utils/calculate-estimate-time.util.js");


const assignDriver = async (orderData) => {
  try {
    console.log(`Assigning driver for order: ${orderData?.orderId}`);

    // Validate orderData before processing
    if (
      !orderData?.restaurantLocation?.coordinates ||
      !orderData?.deliveryLocation?.coordinates
    ) {
      console.error(`Invalid orderData received:`, orderData);
      throw new Error(
        "Invalid orderData: Missing restaurantLocation or deliveryLocation"
      );
    }

    const { restaurantLocation, deliveryLocation } = orderData;

    console.log(`Restaurant Location: ${restaurantLocation.coordinates}`);

    // 1️⃣ Get available driver from User Service
    const response = await axios.get(
      `http://user-service:3001/api/v1/drivers/available`,
      {
        params: {
          longitude: restaurantLocation.coordinates[0], // Ensure order is correct
          latitude: restaurantLocation.coordinates[1],
        },
      }
    );

    console.log(response.data);

    // Log response for debugging
    console.log("Available drivers response:", response.data);

    // Select the first available driver
    const driver = Array.isArray(response.data)
      ? response.data[0]
      : response.data;
      console.log("Driver selected:", driver);

    if (!driver || Object.keys(driver).length === 0) {
      console.log("No available drivers found. Retrying later...");
      return null;
    }

    // 2️⃣ Create delivery record
    const delivery = new Delivery({
      orderId: orderData.orderId,
      driverId: driver._id,
      pickupLocation: {latitude:restaurantLocation.coordinates[1],longitude:restaurantLocation.coordinates[0]},
      deliveryLocation: {latitude:deliveryLocation.coordinates[1],longitude:deliveryLocation.coordinates[0]},
      estimatedTime: calculateEstimatedTime(
        restaurantLocation.coordinates,
        deliveryLocation.coordinates,
        driver.vehicleType
      ), // Ensure this function exists
    });

    await delivery.save();

    // 3️⃣ Update driver status in User Service
    await axios.put(`http://user-service:3001/api/v1/drivers/update-status`, {
      driverId: driver._id,
      isAvailable: false,
    });

    // 4️⃣ Publish event to RabbitMQ
    // const channel = getChannel();
    // channel.publish(
    //   "delivery_events",
    //   "delivery.assigned",
    //   Buffer.from(
    //     JSON.stringify({
    //       deliveryId: delivery._id,
    //       orderId: orderData.orderId,
    //       driverId: driver._id,
    //       estimatedTime: delivery.estimatedTime,
    //     })
    //   ),
    //   { persistent: true }
    // );

    console.log(
      ` Driver assigned: ${driver._id} for order ${orderData.orderId}`
    );
    return delivery;
  } catch (error) {
    console.error("Error assigning driver:", error.message);
    return null;
  }
};

const updateStatus = async (deliveryId, status, location) => {
  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) throw new Error("Delivery not found");

  delivery.status = status;
  if (location) delivery.currentLocation = location;
  if (status === "picked_up") {
    delivery.pickedUpAt = new Date();
    await axios.patch(
      `http://order-purchasing-service:3002/api/v1/orders/${delivery.orderId}`,
      { status: "out_for_delivery" }
    );
  }
  if (status === "delivered") {
    delivery.deliveredAt = new Date();
    // Update order status in order service
    await axios.patch(
      `http://order-purchasing-service:3002/orders/api/v1/orders/${delivery.orderId}`,
      { status: "delivered" }
    );
  }
  await delivery.save();

  // Notify customer
  // const orderRes = await axios.get(`${process.env.ORDER_SERVICE_URL}/orders/${delivery.order}`);
  // const order = orderRes.data;
  // await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/notifications`, {
  //   userId: order.customer,
  //   type: 'delivery_status_update',
  //   message: `Your delivery for order #${delivery.order} has been updated to ${status}`,
  //   orderId: delivery.order,
  //   deliveryId: delivery._id
  // });

  return delivery;
};

const trackDelivery = async (deliveryId, user) => {
  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) throw new Error("Delivery not found");

  // For a customer, verify they are the order owner
  if (user.role === "customer") {
    const orderRes = await axios.get(
      `http://order-purchasing-service:3002/api/v1/orders/${delivery.order}`
    );
    const order = orderRes.data;
    if (order.customer.toString() !== user.userId)
      throw new Error("Not authorized");
  }

  return {
    status: delivery.status,
    currentLocation: delivery.currentLocation,
    startedAt: delivery.startedAt,
    deliveredAt: delivery.deliveredAt,
    estimatedTime: delivery.estimatedTime,
  };
};

const getDeliveryById = async (deliveryId) => {
    const delivery = await Delivery.findById(deliveryId)
      .populate('orderId', 'status totalAmount')
      .populate('driverId', 'name vehicleType');
    
    if (!delivery) {
      throw new Error('Delivery not found');
    }
    return delivery;
  }

  // Get all deliveries (with pagination)
  const getAllDeliveries = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return await Delivery.find()
      .skip(skip)
      .limit(limit)
      .populate('orderId', 'status totalAmount')
      .populate('driverId', 'name vehicleType');
  }

  // Get deliveries by user ID
  const getDeliveriesByUserId = async(userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const orders = await axios.get(`http://order-service:3002/api/orders/user/${userId}`);
    const orderIds = orders.data.map(order => order._id);
    
    return await Delivery.find({ orderId: { $in: orderIds } })
      .skip(skip)
      .limit(limit)
      .populate('orderId', 'status totalAmount')
      .populate('driverId', 'name vehicleType');
  }

  // Get deliveries by driver ID
const getDeliveriesByDriverId = async (driverId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return await Delivery.find({ driverId })
      .skip(skip)
      .limit(limit)

  }

//   const  trackDelivery = async(deliveryId, user) => {
//     const delivery = await Delivery.findById(deliveryId)
//       .populate('orderId', 'customer')
//       .populate('driverId', 'name vehicleType');

//     if (!delivery) throw new Error("Delivery not found");

//     // Authorization
//     if (user.role === "customer" && delivery.orderId.customer.toString() !== user.userId) {
//       throw new Error("Not authorized");
//     }

//     if (user.role === "driver" && delivery.driverId._id.toString() !== user.userId) {
//       throw new Error("Not authorized");
//     }

//     // Subscribe to WebSocket updates
//     io.to(user.socketId).emit('delivery:subscribe', deliveryId);

//     return {
//       delivery,
//       trackingUrl: `/ws/delivery/${deliveryId}/track`
//     };
//   }

//   // WebSocket handler for tracking
//   function setupTrackingSocket(socket) {
//     socket.on('delivery:subscribe', (deliveryId) => {
//       socket.join(`delivery-${deliveryId}`);
//     });

//     socket.on('delivery:location-update', async ({ deliveryId, lat, lng }) => {
//       try {
//         const delivery = await this.updateDeliveryLocation(deliveryId, lat, lng);
//         io.to(`delivery-${deliveryId}`).emit('delivery:location-updated', {
//           deliveryId,
//           location: delivery.currentLocation,
//           status: delivery.status
//         });
//       } catch (error) {
//         socket.emit('error', error.message);
//       }
//     });
//   }

  // Update delivery location
  const updateDeliveryLocation = async (deliveryId, location) => {
    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      {
        currentLocation: location,
        status: "in-transit",
      },
      { new: true }
    );
    if (!delivery) throw new Error("Delivery not found");
    return delivery;
  };

module.exports = { assignDriver, trackDelivery, updateStatus, getDeliveryById, getAllDeliveries, getDeliveriesByUserId, getDeliveriesByDriverId, updateDeliveryLocation };
