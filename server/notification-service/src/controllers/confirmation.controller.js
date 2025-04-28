const { sendOrderConfirmation, sendRegistrationConfirmation } = require('./notification.controller');

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


const confirmRegistration = async (req, res) => {
  const { customerEmail, customerPhone, userName } = req.body;

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

module.exports = { confirmOrder, confirmRegistration };
