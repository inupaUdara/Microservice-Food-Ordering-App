const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },  // e.g., order_received, order_confirmed
  recipient: { type: String, required: true }, // e.g., restaurantEmail or userId
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Object }, // raw orderDetails or additional payload
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
