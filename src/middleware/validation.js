const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Common validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// MongoDB ObjectId validation
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// Auth validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['admin', 'school', 'trustee'])
    .withMessage('Invalid role'),
  body('school_id')
    .custom(isValidObjectId)
    .withMessage('Invalid school ID'),
  validate
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Payment validation rules
const createPaymentValidation = [
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),
  body('student_info.name')
    .notEmpty()
    .trim()
    .withMessage('Student name is required'),
  body('student_info.id')
    .notEmpty()
    .trim()
    .withMessage('Student ID is required'),
  body('student_info.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid student email'),
  validate
];

const paymentStatusValidation = [
  param('collect_request_id')
    .notEmpty()
    .withMessage('Collect request ID is required'),
  validate
];

// Transaction validation rules
const transactionQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['payment_time', 'status', 'transaction_amount'])
    .withMessage('Sort field must be one of: payment_time, status, transaction_amount'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc'),
  validate
];

const schoolIdValidation = [
  param('schoolId')
    .custom(isValidObjectId)
    .withMessage('Invalid school ID'),
  validate
];

const customOrderIdValidation = [
  param('custom_order_id')
    .notEmpty()
    .withMessage('Custom order ID is required'),
  validate
];

// Webhook validation rules
const webhookValidation = [
  body('status')
    .isInt()
    .withMessage('Status must be a number'),
  body('order_info.order_id')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('order_info.order_amount')
    .isFloat({ min: 0 })
    .withMessage('Order amount must be a positive number'),
  body('order_info.transaction_amount')
    .isFloat({ min: 0 })
    .withMessage('Transaction amount must be a positive number'),
  body('order_info.status')
    .isIn(['success', 'failed', 'pending'])
    .withMessage('Invalid payment status'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  createPaymentValidation,
  paymentStatusValidation,
  transactionQueryValidation,
  schoolIdValidation,
  customOrderIdValidation,
  webhookValidation
}; 