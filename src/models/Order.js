const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  trustee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trustee',
    required: true
  },
  student_info: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  gateway_name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create compound index for school_id and created_at
orderSchema.index({ school_id: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema); 