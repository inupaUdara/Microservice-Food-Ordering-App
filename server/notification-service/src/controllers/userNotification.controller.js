// src/controllers/userNotification.controller.js

const { sendSMS } = require('../services/sms.service');
const { sendEmail } = require('../services/email.service');

const sendRegistrationConfirmation = async (customerEmail, customerPhone, userName) => {
  const emailData = { userName };
  const smsText = `Welcome ${userName}! Registration successful.`;

  try {
    await sendSMS(customerPhone, smsText);
    await sendEmail(customerEmail, 'Welcome to Food Delivery Service', 'registration-confirmation', emailData);
    return { success: true, message: 'Registration notifications sent successfully' };
  } catch (error) {
    console.error('Error sending registration notifications:', error);
    return { success: false, message: 'Failed to send registration notifications' };
  }
};

const passwordReset = async (customerEmail, token) => {
  const emailData = { token };

  try {
    await sendEmail(customerEmail, 'Recover your password', 'reset-password', emailData);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error sending reset email notifications:', error);
    return { success: false, message: 'Failed to send reset email notifications' };
  }
};

module.exports = { sendRegistrationConfirmation, passwordReset };
