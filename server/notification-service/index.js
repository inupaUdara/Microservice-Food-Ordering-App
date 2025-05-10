require('./src/config/env');
require('./src/websocket/wsServer');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDatabase = require("./src/config/mongodb.js");
const notificationRoutes = require('./src/routes/notification.routes');


const { PORT } = require('./src/config/env');  

const app = express();


app.use(cors());
app.use(bodyParser.json());

// Set up routes
app.use('/api/v1/notifications', notificationRoutes);

// Start the server on the specified PORT
app.listen(PORT, async () => {
  console.log(`Notification service running on port ${PORT}`);
  await connectToDatabase();
});
