const dotenv = require("dotenv");
dotenv.config();

const { PORT, MONGODB_URI, JWT_SECRET, RESTAURANT_MENU_SERVICE_URL } =
  process.env;

module.exports = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  RESTAURANT_MENU_SERVICE_URL,
};
