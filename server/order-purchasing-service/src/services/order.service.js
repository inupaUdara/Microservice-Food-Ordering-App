const mongoose = require("mongoose");
const { getChannel } = require("../../lib/rabbitmq.js");
const { restaurantServiceClient } = require("./restaurant.service.js");
const Order = require("../models/order.model.js");
const { sendOrderConfirmation } = require("./notification.service.js");

const createOrder = async (userId, restaurantId, products, shippingAddress, paymentId, totalAmount, grandTotal, deliveryFee, customerEmail, customerPhone ) => {
 
  if (!userId || !restaurantId || !products?.length || !shippingAddress || !paymentId || !totalAmount || !grandTotal || !deliveryFee) {
    throw new Error('Missing required fields');
  }

  // const subtotal = products.reduce((sum, product) => {
  //   if (!product.price || !product.quantity) {
  //     throw new Error('Each product must have price and quantity');
  //   }
  //   return sum + (product.price * product.quantity);
  // }, 0);

 
  // const deliveryFee = calculateSimpleDeliveryFee(subtotal);
  // const grandTotal = subtotal + deliveryFee;

  const order = new Order({ 
    userId, 
    restaurantId,
    products, 
    totalAmount,
    deliveryFee,
    grandTotal,
    shippingAddress,
    status: "pending",
    paymentId
  });

  console.log('customerEmail:', customerEmail); 
  console.log('customerPhone:', customerPhone);

  const savedOrder = await order.save();

  try {
    await sendOrderConfirmation(customerEmail, customerPhone, {
      orderId: savedOrder._id,
      totalAmount: savedOrder.totalAmount,
      deliveryFee: savedOrder.deliveryFee,
      grandTotal: savedOrder.grandTotal,
      products: savedOrder.products,
    });
    console.log('Order confirmation notification sent successfully.');
  } catch (err) {
    console.error('Failed to send order confirmation:', err.message);
    // Optional: decide if you want to continue even if notification fails
  }

  return savedOrder;

  
};


// function calculateSimpleDeliveryFee(subtotal) {
//   // Free delivery for large orders
//   if (subtotal > 10000) return 0;
  
//   // Reduced fee for medium orders
//   if (subtotal > 5000) return 200;
  
//   // Standard fee for small orders
//   if (subtotal > 2000) return 400;
  
//   // Minimum order surcharge
//   if (subtotal > 0) return 600;
  
//   throw new Error('Order total must be positive');
// }

const getRestaurantOrders = async (restaurantId) => {
  return await Order.find({ restaurantId }).sort({ createdAt: -1 });
};


const getUserOrders = async (userId) => {
  // Get all orders for the user
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
  
  if (!orders.length) return [];

  // Collect all unique restaurant IDs
  const restaurantIds = [...new Set(orders.map(order => order.restaurantId))];

  console.log('Unique restaurant IDs:', restaurantIds);

  try {
    // Batch fetch all restaurants (more efficient than individual calls)
    const response = await restaurantServiceClient.post('/api/v1/restaurants/batch', {
      ids: restaurantIds
    });

    console.log('Batch restaurant details:', response.data);

    const restaurantsMap = response.data.reduce((map, restaurant) => {
      map[restaurant.id] = {
        name: restaurant.restaurantName,
        logo: restaurant.logo,
        address: restaurant.restaurantAddress,
        phone: restaurant.restaurantPhone,
        rating: restaurant.rating
      };
      return map;
    }, {});

    // Enrich orders with restaurant details
    return orders.map(order => ({
      ...order,
      restaurant: restaurantsMap[order.restaurantId] || null
    }));
  } catch (error) {
   
    console.error('Failed to fetch restaurant details:', error.message);
    return orders;
  }
};

const getOrderById = async (userId, orderId) => {
  // Get the order
  const order = await Order.findOne({ _id: orderId, userId }).lean();
  
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  try {
    // Fetch restaurant details
    const response = await restaurantServiceClient.get(
      `/api/v1/restaurants/${order.restaurantId}`,
      { headers: { 'x-internal-service': 'order-purchasing-service' } }
    );

    console.log('Restaurant details:', response.data);

    const restaurant = response.data.restaurant;

    return {
      ...order,
      restaurant: {
        name: restaurant.restaurantName,
        logo: restaurant.logo,
        address: restaurant.restaurantAddress,
        phone: restaurant.restaurantPhone,
        rating: restaurant.rating
      }
    };
  } catch (error) {
    if (error.response?.status === 404) {
      // Restaurant not found - return order without restaurant details
      console.warn(`Restaurant ${order.restaurantId} not found`);
      return order;
    }
    // For other errors, you might want to throw or handle differently
    console.error('Error fetching restaurant details:', error.message);
    return order;
  }
};

const updateOrderStatus = async (userId, orderId, status) => {
  return await Order.findOneAndUpdate(
    { _id: orderId, userId },
    { status, updatedAt: Date.now() },
    { new: true }
  );
};

const cancelOrder = async (userId, orderId) => {
  return await Order.findOneAndUpdate(
    { _id: orderId, userId, status: { $nin: ["out_for_delivery", "delivered"] } },
    { status: "cancelled", updatedAt: Date.now() },
    { new: true }
  );
};

module.exports = {
    createOrder,
    getRestaurantOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
}