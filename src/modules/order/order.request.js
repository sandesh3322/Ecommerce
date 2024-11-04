const Joi = require('joi');

// Validation schema for address
const addressSchema = Joi.object({
  street: Joi.string().optional(),  // Optional street field
  district: Joi.string().required(),  // Required district field
  city: Joi.string().optional(),  // Optional city field
  landmark: Joi.string().optional(),  // Optional landmark field
  postalCode: Joi.string().optional(),  // Optional postal code field
  country: Joi.string().required()  // Required country field
});

// Order Create DTO validation schema
const OrderCreateDTO = Joi.object({
  cartid: Joi.string().required(),  // Required cart ID
  address: addressSchema.required(),  // Address schema is required
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),  // Phone is required
   // Transaction ID is required
  tax_amount: Joi.number().min(0).optional(),  // Tax amount can be optional
  product_delivery_charge: Joi.number().min(0).optional(),  // Delivery charge can be optional
  product_service_charge: Joi.number().min(0).optional(),
});

// Order Update DTO validation schema (for updating address and phone)
const OrderUpdateDTO = Joi.object({
  cartid: Joi.string().required(),  // Required cart ID
  address: addressSchema.required(),  // Address schema is required
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),  // Phone is required
   // Transaction ID is required
  tax_amount: Joi.number().min(0).optional(),  // Tax amount can be optional
  product_delivery_charge: Joi.number().min(0).optional(),  // Delivery charge can be optional
  product_service_charge: Joi.number().min(0).optional(),
     // Phone is required
});

module.exports = {
  OrderCreateDTO,
  OrderUpdateDTO
};
