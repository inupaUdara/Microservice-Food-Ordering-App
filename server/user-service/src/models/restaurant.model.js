const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  restaurantName: {
    type: String,
    required: [true, "Restaurant name is required"],
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, "License number is required"],
    unique: true,
    trim: true
  },
  logo: {
    type: String,
    default: 'https://logowik.com/content/uploads/images/restaurant9491.logowik.com.webp'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  restaurantPhone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true
  },
  restaurantAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  openingHours: [
    {
      day: { type: String, required: true },
      open: { type: String, required: true },
      close: { type: String, required: true }
    }
  ],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a 2dsphere index for location-based searches
restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;