const axios = require('axios');
const Delivery = require('../models/delivery.model.js');
const { getChannel } = require('../../lib/rabbitmq.js');
const { calculateEstimatedTime } = require('../utils/calculate-estimate-time.util.js');

async function assignDriver(orderData) {
    try {
        console.log(`🚚 Assigning driver for order: ${orderData?.orderId}`);

        // ✅ Validate orderData before processing
        if (!orderData?.restaurantLocation?.coordinates || !orderData?.deliveryLocation?.coordinates) {
            console.error(`❌ Invalid orderData received:`, orderData);
            throw new Error("Invalid orderData: Missing restaurantLocation or deliveryLocation");
        }

        const { restaurantLocation, deliveryLocation } = orderData;

        console.log(`📍 Restaurant Location: ${restaurantLocation.coordinates}`);

        // 1️⃣ Get available driver from User Service
        const response = await axios.get(`http://user-service:3001/api/v1/drivers/available`, {
            params: {
                longitude: restaurantLocation.coordinates[0], // Ensure order is correct
                latitude: restaurantLocation.coordinates[1]
            }
        });

        // Log response for debugging
        console.log('🚗 Available drivers response:', response.data);

        // Select the first available driver
        const driver = Array.isArray(response.data) ? response.data[0] : response.data;

        if (!driver || Object.keys(driver).length === 0) {
            console.log('⚠️ No available drivers found. Retrying later...');
            return null;
        }

        // 2️⃣ Create delivery record
        const delivery = new Delivery({
            orderId: orderData.orderId,
            driverId: driver._id,
            pickupLocation: restaurantLocation,
            deliveryLocation: deliveryLocation,
            estimatedTime: calculateEstimatedTime(
                restaurantLocation.coordinates,
                deliveryLocation.coordinates,
                driver.vehicleType
            ) // Ensure this function exists
        });

        await delivery.save();

        // 3️⃣ Update driver status in User Service
        await axios.put(`http://user-service:3001/api/v1/drivers/update-status`, {
            driverId: driver._id,
            isAvailable: false
        });

        // 4️⃣ Publish event to RabbitMQ
        const channel = getChannel();
        channel.publish(
            'delivery_events',
            'delivery.assigned',
            Buffer.from(JSON.stringify({
                deliveryId: delivery._id,
                orderId: orderData.orderId,
                driverId: driver._id,
                estimatedTime: delivery.estimatedTime
            })),
            { persistent: true }
        );

        console.log(`✅ Driver assigned: ${driver._id} for order ${orderData.orderId}`);
        return delivery;
    } catch (error) {
        console.error('❌ Error assigning driver:', error.message);
        return null;
    }
}
module.exports = { assignDriver };