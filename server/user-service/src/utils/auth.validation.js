const Joi = require('joi');

const baseUserSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required()
};

const registerCustomerSchema = Joi.object({
  ...baseUserSchema,
  role: Joi.string().valid('customer').required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});

const registerRestaurantSchema = Joi.object({
  ...baseUserSchema,
  role: Joi.string().valid('restaurant-admin').required(),
  restaurantName: Joi.string().required(),
  licenseNumber: Joi.string().required()
});

const registerDriverSchema = Joi.object({
  ...baseUserSchema,
  role: Joi.string().valid('delivery-person').required(),
  vehicleType: Joi.string().valid('bike', 'three-wheeler').required(),
  vehicleNumber: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  documents: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('license', 'insurance', 'vehicle-registration').required(),
      url: Joi.string().uri().required()
    })
  ).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  registerDriverSchema,
  registerCustomerSchema,
  registerRestaurantSchema,
  loginSchema
};