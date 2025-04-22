const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Appetizers", "Main Course", "Desserts", "Beverages", "Sides"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 100000,
    },
    image: {
      type: String,
      default: null,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    dietaryTags: {
      type: [String],
      enum: ["vegetarian", "vegan", "gluten-free", "dairy-free"],
      default: [],
    },
    customizations: [
      {
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ["dropdown", "checkbox", "radio"],
          required: true,
        },
        options: [
          {
            label: { type: String, required: true },
            price: { type: Number, default: 0 },
          },
        ],
      },
    ],
    preparationTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    spicyLevel: {
      type: String,
      enum: ["Mild", "Medium", "Hot"],
      default: "Mild",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
