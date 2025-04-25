const { createPaymentIntent } = require('../services/payment.service');
const Payment = require('../models/payment.model');


const FIXED_USER_ID = '60d5f0f57c87d4f3b8b48d62';  // Replace with an actual user ID

const createPayment = async (req, res) => {
  const { amount, userId } = req.body;  // Amount and userId from the request body

  try {
    // Create a payment intent using Stripe API
    const clientSecret = await createPaymentIntent(amount);

    // Save payment details to MongoDB
    const payment = new Payment({
      userId:FIXED_USER_ID ,  // Use a fixed user ID for testing
      amount,
      paymentIntentId: clientSecret,  // Store the payment intent ID in the database
      paymentStatus: 'pending'
    });
    await payment.save();

    // Return the client secret to the frontend
    res.status(200).json({
      message: 'Payment intent created and saved successfully',
      clientSecret
    });
    
  } catch (error) {
    console.error('Error creating and saving payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

module.exports = { createPayment };
