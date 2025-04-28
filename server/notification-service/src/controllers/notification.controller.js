const { sendSMS } = require('../services/sms.service');
const { sendEmail } = require('../services/email.service');

const sendOrderConfirmation = async (customerEmail, customerPhone, orderDetails) => {
  // Only sending necessary data to templates
  const emailData = {
    customerName: orderDetails.customerName,  // Should be part of orderDetails
    orderId: orderDetails.orderId,            // Same
    orderItems: orderDetails.items.join(', ')  // Assuming orderDetails.items is an array of items
  };

  const smsText = `Order confirmed: ${orderDetails.orderId}, Items: ${orderDetails.items.join(', ')}`;

  try {
    // Send SMS
    await sendSMS(customerPhone, smsText);
    
    // Send HTML Email
    await sendEmail(customerEmail, 'Order Confirmation', 'order-confirmation', emailData);

    return { success: true, message: 'Notifications sent successfully' };
  } catch (error) {
    console.error('Error sending notifications:', error);
    return { success: false, message: 'Failed to send notifications' };
  }
};


const sendRegistrationConfirmation = async (customerEmail, customerPhone, userName) => {
  const emailData = { userName };
  const smsText = `Welcome ${userName}! Registration successful.`;

  try {
    await sendSMS(customerPhone, smsText);
    await sendEmail(customerEmail, 'Welcome to Food Delivery Service', 'registration-confirmation', emailData); // Use HTML template
    return { success: true, message: 'Registration notifications sent successfully' };
  } catch (error) {
    console.error('Error sending registration notifications:', error);
    return { success: false, message: 'Failed to send registration notifications' };
  }
};

module.exports = { sendOrderConfirmation, sendRegistrationConfirmation };
