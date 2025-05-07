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

module.exports = { sendRestaurantRegistrationNotification };
