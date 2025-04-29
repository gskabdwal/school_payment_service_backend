const mongoose = require('mongoose');

const orderStatusSchema = new mongoose.Schema({
  collect_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  order_amount: {
    type: Number,
    required: true
  },
  transaction_amount: {
    type: Number,
    required: true
  },
  payment_mode: {
    type: String,
    required: true
  },
  payment_details: {
    type: String,
    required: true
  },
  bank_reference: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  payment_message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'success', 'failed']
  },
  error_message: {
    type: String,
    default: 'NA'
  },
  payment_time: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Create compound index for status and payment_time
orderStatusSchema.index({ status: 1, payment_time: -1 });

// Create compound index for bank_reference (custom_order_id) and status
// This optimizes queries that filter by both custom_order_id and status
orderStatusSchema.index({ bank_reference: 1, status: 1 });

module.exports = mongoose.model('OrderStatus', orderStatusSchema); 