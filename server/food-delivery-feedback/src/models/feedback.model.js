const mongoose = require('mongoose');


const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  rating: { type: Number, min: 1, max: 5, required: true },  // Rating between 1 to 5
  message: { type: String, required: true },
  images: [{ type: String }],  // Array of image file paths
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false },  // Link to order
  status: { type: String, enum: ['pending', 'resolved', 'replied'], default: 'pending' },  // Feedback status
  reply: { type: String, default: null },  // Admin's reply
  feedbackDate: { type: Date, default: Date.now },  // Date feedback was created
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },  // User's ID if logged in
  foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: false },  // Link to food item
  location: { type: String, required: false },  // Delivery location
  anonymous: { type: Boolean, default: false }  // Whether the feedback is anonymous
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
