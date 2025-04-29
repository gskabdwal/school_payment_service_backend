const express = require('express');
const router = express.Router();
const OrderStatus = require('../models/OrderStatus');
const WebhookLog = require('../models/WebhookLog');
const { webhookValidation } = require('../middleware/validation');

router.post('/', webhookValidation, async (req, res) => {
  try {
    const {
      status,
      order_info: {
        order_id,
        order_amount,
        transaction_amount,
        gateway,
        bank_reference,
        status: payment_status,
        payment_mode,
        payment_details,
        Payment_message,
        payment_time,
        error_message
      }
    } = req.body;

    // Log webhook
    const webhookLog = new WebhookLog({
      order_id,
      payload: req.body,
      status: status
    });
    await webhookLog.save();

    // Update order status
    const orderStatus = await OrderStatus.findOne({ collect_id: order_id });
    if (!orderStatus) {
      webhookLog.error = 'Order not found';
      await webhookLog.save();
      return res.status(404).json({ message: 'Order not found' });
    }

    orderStatus.order_amount = order_amount;
    orderStatus.transaction_amount = transaction_amount;
    orderStatus.payment_mode = payment_mode;
    orderStatus.payment_details = payment_details;
    orderStatus.bank_reference = bank_reference;
    orderStatus.payment_message = Payment_message;
    orderStatus.status = payment_status.toLowerCase();
    orderStatus.error_message = error_message;
    orderStatus.payment_time = new Date(payment_time);

    await orderStatus.save();
    webhookLog.processed = true;
    await webhookLog.save();

    res.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Error processing webhook' });
  }
});

module.exports = router; 