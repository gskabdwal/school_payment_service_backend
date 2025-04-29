const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true
  },
  payload: {
    type: Object,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  processed: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WebhookLog', webhookLogSchema); 