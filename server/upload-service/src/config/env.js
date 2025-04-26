const dotenv = require("dotenv");
dotenv.config();

const { PORT, MONGODB_URI, UPLOAD_DIR, UPLOAD_SERVICE_URL } = process.env;

module.exports = {
  PORT,
  MONGODB_URI,
  UPLOAD_DIR,
  UPLOAD_SERVICE_URL,
};
