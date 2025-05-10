const { sendOrderConfirmation, sendOrderCompleteNotification, sendOrderCancellationNotification } = require('./orderNotification.controller');
const { sendRegistrationConfirmation, passwordReset } = require('./userNotification.controller');
const { sendRestaurantRegistrationNotification, sendOrderReceivedNotification  } = require('./restaurantNotification.controller');
const { broadcastOrderAssignment, broadcastOrderReceived  } = require('../websocket/wsServer'); // Ensure this import is here




const notifyOrderReceived = async (req, res) => {
  const { restaurantEmail, restaurantPhone, restaurantName, orderDetails } = req.body;

  try {
    // Send SMS + Email (optional)
    await sendOrderReceivedNotification(restaurantEmail, restaurantPhone, restaurantName, orderDetails);

    // Real-time push via WebSocket
    broadcastOrderReceived(orderDetails, restaurantEmail);


    return res.status(200).json({ message: 'Order received notification sent to restaurant.' });
  } catch (error) {
    console.error('Error notifying restaurant of order received:', error);
    return res.status(500).json({ message: 'Failed to notify restaurant.' });
  }
};


const confirmOrder = async (req, res) => {
  const { customerEmail, customerPhone, orderDetails } = req.body;

  try {
    const confirmationResult = await sendOrderConfirmation(customerEmail, customerPhone, orderDetails);

    if (confirmationResult.success) {
      console.log('Order confirmed, broadcasting:', orderDetails);
      broadcastOrderAssignment(orderDetails);
      return res.status(200).json({ message: 'Order confirmed and notifications sent.' });
    } else {
      return res.status(500).json({ message: 'Failed to send order confirmation.' });
    }
  } catch (error) {
    console.error('Error confirming order:', error);
    return res.status(500).json({ message: 'Error confirming order.' });
  }
};

const confirmOrderCompletion = async (req, res) => {
  const { customerEmail, customerPhone, orderDetails } = req.body;

  try {
    const confirmationResult = await sendOrderCompleteNotification(customerEmail, customerPhone, orderDetails);

    if (confirmationResult.success) {
      return res.status(200).json({ message: 'Order completion notifications sent successfully.' });
    } else {
      return res.status(500).json({ message: 'Failed to send order completion notifications.' });
    }
  } catch (error) {
    console.error('Error confirming order completion:', error);
    return res.status(500).json({ message: 'Error confirming order completion.' });
  }
};

const confirmRegistration = async (req, res) => {
  const { customerEmail, userName } = req.body;

  try {
    const confirmationResult = await sendRegistrationConfirmation(customerEmail, customerPhone, userName);

    if (confirmationResult.success) {
      return res.status(200).json({ message: 'Registration confirmed and notifications sent.' });
    } else {
      return res.status(500).json({ message: 'Failed to send registration confirmation.' });
    }
  } catch (error) {
    console.error('Error confirming registration:', error);
    return res.status(500).json({ message: 'Error confirming registration.' });
  }
};

const resetPasswordToken = async (req, res) => {
  const { customerEmail, token } = req.body;

  try {
    const confirmationResult = await passwordReset(customerEmail, token);

    if (confirmationResult.success) {
      return res.status(200).json({ message: 'Password reset email sent.' });
    } else {
      return res.status(500).json({ message: 'Failed to send password reset email.' });
    }
  } catch (error) {
    console.error('Error Password reset email:', error);
    return res.status(500).json({ message: 'Error password reset email' });
  }
};

const cancelOrder = async (req, res) => {
  const { customerEmail, customerPhone, orderDetails, canceledBy } = req.body;  // "customer" or "restaurant"

  try {
    const confirmationResult = await sendOrderCancellationNotification(customerEmail, customerPhone, orderDetails, canceledBy);

    if (confirmationResult.success) {
      return res.status(200).json({ message: 'Order cancellation notifications sent.' });
    } else {
      return res.status(500).json({ message: 'Failed to send order cancellation notifications.' });
    }
  } catch (error) {
    console.error('Error canceling order:', error);
    return res.status(500).json({ message: 'Error canceling order.' });
  }
};


const confirmRestaurantRegistration = async (req, res) => {
  const { restaurantEmail, restaurantPhone, restaurantName } = req.body;

  try {
    const confirmationResult = await sendRestaurantRegistrationNotification(restaurantEmail, restaurantPhone, restaurantName);

    if (confirmationResult.success) {
      return res.status(200).json({ message: 'Restaurant registration confirmed and notifications sent.' });
    } else {
      return res.status(500).json({ message: 'Failed to send restaurant registration confirmation.' });
    }
  } catch (error) {
    console.error('Error confirming restaurant registration:', error);
    return res.status(500).json({ message: 'Error confirming restaurant registration.' });
  }
};


module.exports = { confirmOrder, confirmOrderCompletion, confirmRegistration, cancelOrder, confirmRestaurantRegistration, resetPasswordToken, notifyOrderReceived };