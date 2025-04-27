const dotenv = require('dotenv');
dotenv.config();  

const { PORT, STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, MONGODB_URI } = process.env;

// Export environment variables for use in the application
module.exports = {
    PORT,
    STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY,
    MONGODB_URI
};
