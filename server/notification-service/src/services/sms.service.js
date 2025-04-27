const twilio = require('twilio');
require('dotenv').config();

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = (to, message) => {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER, // Ensure this is a valid Twilio phone number
    to: to,
  })
  .then(message => {
    console.log('SMS sent successfully:', message.sid);  // Log the message SID for success
    return message;
  })
  .catch(error => {
    console.error('Error sending SMS:', error);  // Log any error from Twilio
    throw error;
  });
};

module.exports = { sendSMS };
