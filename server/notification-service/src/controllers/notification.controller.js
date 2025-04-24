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

module.exports = { sendOrderConfirmation };
