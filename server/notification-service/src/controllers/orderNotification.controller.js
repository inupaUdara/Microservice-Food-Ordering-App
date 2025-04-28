// src/controllers/orderNotification.controller.js

const { sendSMS } = require('../services/sms.service');
const { sendEmail } = require('../services/email.service');
const { broadcastOrderCompletion } = require('../websocket/wsServer');

const sendOrderConfirmation = async (customerEmail, customerPhone, orderDetails) => {
  const emailData = {
    customerName: orderDetails.customerName,
    orderId: orderDetails.orderId,
    orderItems: orderDetails.items.join(', ')
  };
  const smsText = `Order confirmed: ${orderDetails.orderId}, Items: ${orderDetails.items.join(', ')}`;

  try {
    await sendSMS(customerPhone, smsText);
    await sendEmail(customerEmail, 'Order Confirmation', 'order-confirmation', emailData);
    return { success: true, message: 'Order confirmation notifications sent successfully' };
  } catch (error) {
    console.error('Error sending order confirmation notifications:', error);
    return { success: false, message: 'Failed to send order confirmation notifications' };
  }
};

const sendOrderCompleteNotification = async (customerEmail, customerPhone, orderDetails) => {
    const emailData = {
      customerName: orderDetails.customerName,  // Dynamic customer name
      orderId: orderDetails.orderId,            // Dynamic order ID
      orderItems: orderDetails.items.join(', ') // Join items array into a string for the email
    };
  
    const smsText = `Your order ${orderDetails.orderId} has been delivered successfully. Thank you!`;
  
    try {
      // Send SMS to customer
      await sendSMS(customerPhone, smsText);
  
      // Send Email to customer with dynamic data
      await sendEmail(customerEmail, 'Order Delivered Successfully', 'order-completion', emailData);
  
      // Broadcast real-time notification to delivery personnel (WebSocket)
      broadcastOrderCompletion(orderDetails);  // <-- This will now work
  
      return { success: true, message: 'Order completion notifications sent successfully' };
    } catch (error) {
      console.error('Error sending order completion notifications:', error);
      return { success: false, message: 'Failed to send order completion notifications' };
    }
  };
  

module.exports = { sendOrderConfirmation, sendOrderCompleteNotification };
