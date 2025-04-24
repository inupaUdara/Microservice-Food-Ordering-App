const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const notificationRoutes = require('./src/routes/notification.routes');
require('./src/websocket/wsServer'); // Initialize WebSocket server

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1/notifications', notificationRoutes);

app.listen(port, () => {
  console.log(`Notification service running on port ${port}`);
});
