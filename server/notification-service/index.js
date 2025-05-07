require('./src/config/env');  // Import and load environment variables from env.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const notificationRoutes = require('./src/routes/notification.routes');  // Import routes for notification

const { PORT } = require('./src/config/env');  

const app = express();


app.use(cors());
app.use(bodyParser.json());

// Set up routes
app.use('/api/v1/notifications', notificationRoutes);

// Start the server on the specified PORT
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
