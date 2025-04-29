const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const { createPaymentValidation, paymentStatusValidation } = require('../middleware/validation');

// Create payment
router.post('/create-payment', auth, createPaymentValidation, async (req, res) => {
  try {
    const { amount, student_info } = req.body;
    
    // Create order
    const order = new Order({
      school_id: req.user.school_id,
      trustee_id: req.user._id,
      student_info,
      gateway_name: 'edviron'
    });
    await order.save();

    // Generate JWT sign for payment gateway
    const signPayload = {
      school_id: process.env.SCHOOL_ID,
      amount: amount.toString(),
      callback_url: `${process.env.BASE_URL}/api/payments/callback`
    };
    
    const sign = jwt.sign(signPayload, process.env.PG_KEY);

    // Call payment gateway API
    const response = await axios.post(
      'https://dev-vanilla.edviron.com/erp/create-collect-request',
      {
        school_id: process.env.SCHOOL_ID,
        amount: amount.toString(),
        callback_url: `${process.env.BASE_URL}/api/payments/callback`,
        sign
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYMENT_API_KEY}`
        }
      }
    );

    // Create initial order status
    const orderStatus = new OrderStatus({
      collect_id: order._id,
      order_amount: amount,
      transaction_amount: amount,
      payment_mode: 'pending',
      payment_details: 'pending',
      bank_reference: 'pending',
      payment_message: 'Payment initiated',
      status: 'pending',
      payment_time: new Date()
    });
    await orderStatus.save();

    res.json({
      collect_request_id: response.data.collect_request_id,
      payment_url :  response.data.collect_request_url,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: 'Error creating payment' });
  }
});

// Check payment status
router.get('/status/:collect_request_id', auth, paymentStatusValidation, async (req, res) => {
  try {
    const { collect_request_id } = req.params;
    
    const signPayload = {
      school_id: process.env.SCHOOL_ID,
      collect_request_id
    };
    
    const sign = jwt.sign(signPayload, process.env.PG_KEY);

    const response = await axios.get(
      `https://dev-vanilla.edviron.com/erp/collect-request/${collect_request_id}`,
      {
        params: {
          school_id: process.env.SCHOOL_ID,
          sign
        },
        headers: {
          'Authorization': `Bearer ${process.env.PAYMENT_API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ message: 'Error checking payment status' });
  }
});

module.exports = router; 