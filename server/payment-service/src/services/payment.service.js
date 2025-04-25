const Stripe = require('stripe');
require('dotenv').config();  // Optional if using .env file instead of env.js

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, currency = 'LKR') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert the amount to smallest units (e.g., cents)
      currency: currency,
      metadata: { integration_check: 'accept_a_payment' },
    });
    return paymentIntent.client_secret;  // Return client secret for frontend use
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

module.exports = { createPaymentIntent };
