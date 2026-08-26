const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', orderController.createOrder);

module.exports = router;
