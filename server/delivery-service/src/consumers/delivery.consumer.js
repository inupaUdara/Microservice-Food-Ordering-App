const { getChannel } = require('../../lib/rabbitmq.js');
const { assignDriver } = require('../services/deliver.service.js');

async function startDeliveryConsumer() {
    const channel = getChannel();
  
    channel.consume('delivery_assignment_queue', async (msg) => {
      try {
        const orderData = JSON.parse(msg.content.toString());
        console.log(`📥 Received order for delivery: ${orderData?.orderId || "UNKNOWN ORDER"}`);
  
        // ✅ Check if the message is valid before processing
        if (!orderData?.restaurantLocation?.coordinates || !orderData?.deliveryLocation?.coordinates) {
          console.error(`❌ Invalid orderData received. Discarding message:`, orderData);
          channel.ack(msg); // ✅ Discard invalid message to avoid infinite retry
          return;
        }
  
        const delivery = await assignDriver(orderData);
  
        if (delivery) {
          console.log(`✅ Delivery assigned for order ${orderData.orderId}`);
          channel.ack(msg); // ✅ Acknowledge successful processing
        } else {
          console.log(`⏳ No driver available. Retrying order ${orderData.orderId} in 5 seconds`);
          
          // ⏳ Delay retry to prevent infinite looping
          setTimeout(() => channel.nack(msg, false, true), 5000);
        }
      } catch (error) {
        console.error(`❌ Delivery assignment failed: ${error.message}`);
        
        // If error is temporary, retry later
        setTimeout(() => channel.nack(msg, false, true), 5000);
      }
    });
  
    console.log("🚀 Delivery Consumer Started!");
  }

module.exports = { startDeliveryConsumer };