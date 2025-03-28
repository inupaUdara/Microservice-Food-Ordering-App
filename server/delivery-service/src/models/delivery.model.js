const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'picked-up', 'in-transit', 'delivered', 'cancelled'],
    default: 'assigned'
  },
  pickupLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  deliveryLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: [Number]
  },
  estimatedTime: Number, // in minutes
  actualTime: Number, // in minutes
  startedAt: Date,
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

deliverySchema.index({ pickupLocation: '2dsphere' });
deliverySchema.index({ deliveryLocation: '2dsphere' });
deliverySchema.index({ currentLocation: '2dsphere' });

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;