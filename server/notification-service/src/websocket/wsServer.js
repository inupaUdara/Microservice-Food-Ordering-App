const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New delivery personnel connected');

  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  // Send real-time order updates
  const sendNotification = (orderDetails) => {
    ws.send(JSON.stringify({ type: 'order_update', data: orderDetails }));
  };

  // Trigger notifications for delivery person when a new order is assigned
  sendNotification({ orderId: '12345', status: 'Assigned' });
});
