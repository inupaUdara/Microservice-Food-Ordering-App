const dotenv = require('dotenv');
dotenv.config();

const { PORT, MONGODB_URI } = process.env;

// Export environment variables
module.exports = {
    PORT,
    MONGODB_URI
};
