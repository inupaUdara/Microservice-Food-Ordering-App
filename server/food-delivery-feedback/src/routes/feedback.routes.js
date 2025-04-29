const express = require('express');
const { createFeedbackHandler, getAllFeedbackHandler, getFeedbackByIdHandler, updateFeedbackByIdHandler, deleteFeedbackByIdHandler, getFeedbackByRestaurantIdHandler } = require('../controllers/feedback.controller');
const multer = require('multer');
const path = require('path');

// Set up multer properly
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads')); // <-- correct absolute path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/', upload.array('images', 5), createFeedbackHandler);
router.get('/', getAllFeedbackHandler);
router.get('/:id', getFeedbackByIdHandler);
router.put('/:id', upload.array('images', 5), updateFeedbackByIdHandler);
router.get('/restaurant/:restaurantId', getFeedbackByRestaurantIdHandler);
router.delete('/:id', deleteFeedbackByIdHandler);

module.exports = router;
