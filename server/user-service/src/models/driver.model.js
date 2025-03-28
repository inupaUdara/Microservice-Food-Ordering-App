const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'three-wheeler'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: [Number]
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  activeOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery'
  }],
  maxActiveOrders: {
    type: Number,
    default: 1
  },
  documents: [{
    type: { type: String, enum: ['license', 'insurance', 'vehicle-registration'] },
    url: String,
    verified: { type: Boolean, default: false }
  }]
});

driverSchema.index({ currentLocation: '2dsphere' });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;