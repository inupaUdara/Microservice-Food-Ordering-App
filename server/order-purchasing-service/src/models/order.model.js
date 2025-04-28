const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  paymentId: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending","reject", "confirmed","preparing", "out_for_delivery", "delivered", "cancelled"],
    default: "pending"
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.virtual('restaurant', {
  ref: 'Restaurant',
  localField: 'restaurantId',
  foreignField: '_id',
  justOne: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;