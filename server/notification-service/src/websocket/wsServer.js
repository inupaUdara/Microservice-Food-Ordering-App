const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New delivery personnel connected.');

  ws.on('message', (message) => {
    console.log('Received message from delivery personnel:', message);
  });

  ws.on('close', () => {
    console.log('Delivery personnel disconnected.');
  });
});

const broadcastOrderAssignment = (orderDetails) => {
  const payload = JSON.stringify({
    type: 'order_assignment',
    data: orderDetails
  });

  console.log('Broadcasting to', wss.clients.size, 'clients with payload:', payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};
// Function to broadcast an order completion notification to all connected delivery personnel
const broadcastOrderCompletion = (orderDetails) => {
  const payload = JSON.stringify({
    type: 'order_completion',
    data: orderDetails
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload); // Send the message in the correct format
    }
  });
};

// Function to broadcast an order cancellation notification to all connected delivery personnel
const broadcastOrderCancellation = (orderDetails) => {
  const payload = JSON.stringify({
    type: 'order_canceled',
    data: orderDetails
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);  // Send the cancellation message to all connected clients
    }
  });
};

module.exports = { broadcastOrderAssignment, broadcastOrderCompletion, broadcastOrderCancellation };
