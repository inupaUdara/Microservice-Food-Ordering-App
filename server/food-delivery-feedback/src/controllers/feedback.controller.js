const { createFeedback, getAllFeedback, getFeedbackById, updateFeedbackById, deleteFeedbackById } = require('../services/feedback.service');

// Create new feedback entry
const createFeedbackHandler = async (req, res) => {
  const { name, email, rating, message, orderId, status, foodItemId, location, userId, anonymous } = req.body;

  // FIX: Save only filenames, not full paths
  const images = req.files ? req.files.map(file => file.filename) : [];

  try {
    const feedback = await createFeedback(name, email, rating, message, images, orderId, status, foodItemId, location, userId, anonymous);
    res.status(201).json({ message: 'Feedback created successfully', feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Error creating feedback' });
  }
};

// Get all feedback entries
const getAllFeedbackHandler = async (req, res) => {
  try {
    const feedback = await getAllFeedback();
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ message: 'Error retrieving feedback' });
  }
};

// Get single feedback entry by ID
const getFeedbackByIdHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const feedback = await getFeedbackById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error retrieving feedback by ID:', error);
    res.status(500).json({ message: 'Error retrieving feedback by ID' });
  }
};

// Update feedback entry by ID
const updateFeedbackByIdHandler = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // FIX: Save only filenames, not full paths
  const images = req.files ? req.files.map(file => file.filename) : [];

  try {
    const updatedFeedback = await updateFeedbackById(id, updateData, images);
    res.status(200).json({ message: 'Feedback updated successfully', updatedFeedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: 'Error updating feedback' });
  }
};

// Delete feedback entry by ID
const deleteFeedbackByIdHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteFeedbackById(id);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Error deleting feedback' });
  }
};

module.exports = { createFeedbackHandler, getAllFeedbackHandler, getFeedbackByIdHandler, updateFeedbackByIdHandler, deleteFeedbackByIdHandler };
