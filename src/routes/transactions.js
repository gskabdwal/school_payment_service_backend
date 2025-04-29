const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const { transactionQueryValidation, schoolIdValidation, customOrderIdValidation } = require('../middleware/validation');

// Get all transactions with pagination and sorting
router.get('/', auth, transactionQueryValidation, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'payment_time';
    const order = req.query.order || 'desc';

    // Map sort field to actual field in the aggregation
    const sortFieldMap = {
      'payment_time': 'status.payment_time',
      'status': 'status.status',
      'transaction_amount': 'status.transaction_amount'
    };

    const sortField = sortFieldMap[sort];
    const sortOrder = order === 'asc' ? 1 : -1;

    const transactions = await Order.aggregate([
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status'
        }
      },
      {
        $unwind: '$status'
      },
      {
        $project: {
          collect_id: '$status.bank_reference',
          school_id: 1,
          gateway: '$gateway_name',
          order_amount: '$status.order_amount',
          transaction_amount: '$status.transaction_amount',
          status: '$status.status',
          custom_order_id: '$_id',
          payment_time: '$status.payment_time'
        }
      },
      {
        $sort: { [sortField]: sortOrder }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    const total = await Order.countDocuments();

    res.json({
      transactions,
      pagination: {
        total,
        page,
        limit
      },
      sorting: {
        field: sort,
        order
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Get school transactions with pagination and sorting
router.get('/school/:schoolId', auth, schoolIdValidation, transactionQueryValidation, async (req, res) => {
  try {
    const { schoolId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'payment_time';
    const order = req.query.order || 'desc';

    // Map sort field to actual field in the aggregation
    const sortFieldMap = {
      'payment_time': 'status.payment_time',
      'status': 'status.status',
      'transaction_amount': 'status.transaction_amount'
    };

    const sortField = sortFieldMap[sort];
    const sortOrder = order === 'asc' ? 1 : -1;

    const transactions = await Order.aggregate([
      {
        $match: {
          school_id: new mongoose.Types.ObjectId(schoolId)
        }
      },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status'
        }
      },
      {
        $unwind: '$status'
      },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gateway_name',
          order_amount: '$status.order_amount',
          transaction_amount: '$status.transaction_amount',
          status: '$status.status',
          custom_order_id: '$status.bank_reference',
          payment_time: '$status.payment_time'
        }
      },
      {
        $sort: { [sortField]: sortOrder }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    const total = await Order.countDocuments({ school_id: schoolId });

    res.json({
      transactions,
      pagination: {
        total,
        page,
        limit
      },
      sorting: {
        field: sort,
        order
      }
    });
  } catch (error) {
    console.error('Error fetching school transactions:', error);
    res.status(500).json({ message: 'Error fetching school transactions' });
  }
});

// Get transaction status
router.get('/status/:custom_order_id', auth, customOrderIdValidation, async (req, res) => {
  try {
    const { custom_order_id } = req.params;
    
    const orderStatus = await OrderStatus.findOne({ collect_id: custom_order_id });
    if (!orderStatus) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(orderStatus);
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    res.status(500).json({ message: 'Error fetching transaction status' });
  }
});

module.exports = router; 