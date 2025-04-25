const express = require('express');
const { createFeedbackHandler, getAllFeedbackHandler, getFeedbackByIdHandler, updateFeedbackByIdHandler, deleteFeedbackByIdHandler } = require('../controllers/feedback.controller');
const multer = require('multer');
const path = require('path');

// Set up multer to store files in the 'uploads/' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Ensure unique filenames
  }
});
const upload = multer({ storage: storage });

const router = express.Router();

// POST route to create feedback with images
router.post('/', upload.array('images', 5), createFeedbackHandler);  // Upload up to 5 images

// GET route to retrieve all feedback
router.get('/', getAllFeedbackHandler);

// GET route to retrieve a single feedback by ID
router.get('/:id', getFeedbackByIdHandler);

// PUT route to update a feedback entry by ID
router.put('/:id', upload.array('images', 5), updateFeedbackByIdHandler);  // Upload up to 5 images

// DELETE route to delete a feedback entry by ID
router.delete('/:id', deleteFeedbackByIdHandler);

module.exports = router;
