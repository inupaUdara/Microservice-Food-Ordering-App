const dotenv = require('dotenv');
dotenv.config();  // Loads environment variables from the .env file

const { 
  PORT, 
  TWILIO_ACCOUNT_SID, 
  TWILIO_AUTH_TOKEN, 
  TWILIO_PHONE_NUMBER, 
  SMTP_HOST, 
  SMTP_PORT, 
  SMTP_USER, 
  SMTP_PASS 
} = process.env;  //environment variables

// Export environment variables for use in the application
module.exports = {
  PORT,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS
};
