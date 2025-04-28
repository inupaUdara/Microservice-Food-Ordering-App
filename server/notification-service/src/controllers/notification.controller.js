const { sendSMS } = require('../services/sms.service');
const { sendEmail } = require('../services/email.service');

const sendOrderConfirmation = async (customerEmail, customerPhone, orderDetails) => {
  const emailText = `Your order has been confirmed. Details: ${orderDetails}`;
  const smsText = `Order confirmed: ${orderDetails}`;

  try {
    await sendSMS(customerPhone, smsText);
    await sendEmail(customerEmail, 'Order Confirmation', emailText);
    return { success: true, message: 'Notifications sent successfully' };
  } catch (error) {
    console.error('Error sending notifications:', error);
    return { success: false, message: 'Failed to send notifications' };
  }
};


const sendRegistrationConfirmation = async (customerEmail, customerPhone, userName) => {
  const emailText = `Hello ${userName}, welcome! Your registration was successful.`;
  const smsText = `Welcome ${userName}! Registration successful.`;

  try {
    await sendSMS(customerPhone, smsText);
    await sendEmail(customerEmail, 'Welcome to Food Delivery Service', emailText);
    return { success: true, message: 'Registration notifications sent successfully' };
  } catch (error) {
    console.error('Error sending registration notifications:', error);
    return { success: false, message: 'Failed to send registration notifications' };
  }
};

module.exports = { sendOrderConfirmation, sendRegistrationConfirmation };
