const Notification = require('../models/notification.model');

// Save notification to DB
const saveNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ message: 'Notification saved', data: notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save notification' });
  }
};

// Fetch notifications (optionally filter by recipient)
const getNotifications = async (req, res) => {
  const { recipient } = req.query;
  const filter = recipient ? { recipient } : {};

  try {
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ data: notifications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

module.exports = { saveNotification, getNotifications };
