const Feedback = require('../models/feedback.model');
const fs = require('fs');
const path = require('path');

// Create a new feedback entry
const createFeedback = async (name, email, rating, message, images, orderId, status = 'pending', foodItemId = null, location = null, userId = null, anonymous = false, restaurantId) => {
  const feedback = new Feedback({
    name,
    email,
    rating,
    message,
    images,
    orderId,
    status,
    foodItemId,
    location,
    userId,
    anonymous,
    restaurantId,
  });
  return await feedback.save();
};

// Get all feedback entries
const getAllFeedback = async () => {
  return await Feedback.find();
};

// Get feedback by ID
const getFeedbackById = async (id) => {
  return await Feedback.findById(id);
};

// Update a feedback entry by ID
const updateFeedbackById = async (id, updateData, newImages) => {
  const feedback = await Feedback.findById(id);
  
  // If new images are uploaded, remove old images from the uploads folder
  if (newImages && newImages.length > 0) {
    feedback.images.forEach(image => {
      fs.unlinkSync(path.join(__dirname, '..', 'uploads', image));  // Deleting old images from the uploads folder
    });
    feedback.images = newImages;
  }

  // Update the feedback with the provided data
  return await Feedback.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete a feedback entry by ID
const deleteFeedbackById = async (id) => {
  const feedback = await Feedback.findById(id);
  
  // Remove images from storage
  feedback.images.forEach(image => {
    fs.unlinkSync(path.join(__dirname, '..', 'uploads', image));  // Deleting images from the uploads folder
  });

  // Delete the feedback from the database
  return await Feedback.findByIdAndDelete(id);
};

const getFeedbackByRestaurantId = async (restaurantId) => {
  return await Feedback.find({ restaurantId }).sort({ feedbackDate: -1 });
}

module.exports = { createFeedback, getAllFeedback, getFeedbackById, updateFeedbackById, deleteFeedbackById, getFeedbackByRestaurantId };
