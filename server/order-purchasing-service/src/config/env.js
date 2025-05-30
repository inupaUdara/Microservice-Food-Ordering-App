const dotenv = require('dotenv');
dotenv.config();

const { PORT, MONGODB_URI, JWT_SECRET, USER_SERVICE_URL, NOTIFICATION_SERVICE_URL } = process.env;

module.exports = {
    PORT,
    MONGODB_URI,
    JWT_SECRET,
    USER_SERVICE_URL,
    NOTIFICATION_SERVICE_URL,
};