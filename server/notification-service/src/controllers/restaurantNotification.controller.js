// src/controllers/restaurantNotification.controller.js

const { sendSMS } = require('../services/sms.service');
const { sendEmail } = require('../services/email.service');

// Function to send restaurant registration notifications (SMS & Email)
const sendRestaurantRegistrationNotification = async (restaurantEmail, restaurantPhone, restaurantName) => {
  const emailData = { restaurantName };
  const smsText = `Welcome ${restaurantName}! You have successfully registered with our food delivery service.`;

  try {
    // Send SMS to restaurant
    await sendSMS(restaurantPhone, smsText);

    // Send email to restaurant
    await sendEmail(restaurantEmail, 'Restaurant Registration Successful', 'restaurant-registration', emailData);

    return { success: true, message: 'Restaurant registration notifications sent successfully' };
  } catch (error) {
    console.error('Error sending restaurant registration notifications:', error);
    return { success: false, message: 'Failed to send restaurant registration notifications' };
  }
};


const sendOrderReceivedNotification = async (restaurantEmail, restaurantPhone, restaurantName, orderDetails) => {
  const emailData = {
    restaurantName,
    orderId: orderDetails.orderId,
    orderItems: orderDetails.items.join(', ')
  };

  const smsText = `New order received: #${orderDetails.orderId} for ${orderDetails.items.join(', ')}. Please confirm.`;

  try {
    await sendSMS(restaurantPhone, smsText);
    await sendEmail(restaurantEmail, 'New Order Received', 'restaurant-order-received', emailData);

    return { success: true, message: 'Order received notification sent successfully' };
  } catch (error) {
    console.error('Error sending order received notification:', error);
    return { success: false, message: 'Failed to send order received notification' };
  }
};


module.exports = { sendRestaurantRegistrationNotification, sendOrderReceivedNotification };
