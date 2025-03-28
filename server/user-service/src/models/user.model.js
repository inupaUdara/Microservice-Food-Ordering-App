const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "restaurant-admin", "admin", "delivery-person"],
      default: "customer",
    },
    lastLogin: { type: Date },

    // Fields for Customer
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    // Fields for Restaurant Admin
    restaurantName: { type: String, trim: true },
    licenseNumber: { type: String, trim: true },
    isApproved: { type: Boolean },

    driverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
    }
  },
  { timestamps: true }
);

userSchema.virtual('driver', {
  ref: 'Driver',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
