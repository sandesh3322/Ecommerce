const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const attributeSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  });

const productSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  }],
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: false
  },
  afterdiscount: {
    type: Number,
    default: function() {
      return this.price - this.discount;
    }
  },
  sellerid: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  stockquantity: {
    type: Number,
    required: true,
    default: 1, 
  },
  attributes: [attributeSchema],
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String
  }],
  
}, {
  timestamps: true  // Automatically manages createdAt and updatedAt fields
});

// Creating indexes


const ProductModal = mongoose.model('Product', productSchema);

module.exports = ProductModal;
