const { sendOrderConfirmation } = require('./notification.controller');

const confirmOrder = async (req, res) => {
  const { customerEmail, customerPhone, orderDetails } = req.body;

  try {
    const confirmationResult = await sendOrderConfirmation(customerEmail, customerPhone, orderDetails);

    if (confirmationResult.success) {
      return res.status(200).json({ message: 'Order confirmed and notifications sent.' });
    } else {
      return res.status(500).json({ message: 'Failed to send confirmation.' });
    }
  } catch (error) {
    console.error('Error confirming order:', error);
    return res.status(500).json({ message: 'Error confirming order.' });
  }
};

module.exports = { confirmOrder };
