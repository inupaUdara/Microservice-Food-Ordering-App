const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Restaurant" },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed","preparing", "out_for_delivery", "delivered", "cancelled"],
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

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;