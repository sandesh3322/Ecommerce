const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  
  cartid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true
  },
  address: {
    street: { type: String, required: false },
    district: { type: String, required: true },
    city: { type: String, required: false },
    landmark: { type: String, required: false },
    postalCode: { type: String, required: false },
    country: { type: String, required: true }
  },
  phone: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  tax_amount: {
    type: Number,
    default: 0
  },
  total_amount: {
    type: Number,
    required: true
  },
  transaction_uuid: {
    type: String,
    required: true
  },
  product_delivery_charge: {
    type: Number,
    default: 0
  },
  product_service_charge: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'completed'],
    default: 'unpaid'
  }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);
module.exports = OrderModel;
