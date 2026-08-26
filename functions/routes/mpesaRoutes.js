const express = require('express');
const router = express.Router();
const mpesaController = require('../controllers/mpesaController');

// @route   POST /api/payment/mpesa
// @desc    Initiate an M-Pesa STK Push
router.post('/', mpesaController.initiateStkPush);

// @route   POST /api/payment/mpesa/callback
// @desc    Handle Safaricom M-Pesa callback
router.post('/callback', mpesaController.handleCallback);

// @route   GET /api/payment/mpesa/settings
// @desc    Get current M-Pesa environment settings (admin)
router.get('/settings', mpesaController.getSettings);

// @route   PUT /api/payment/mpesa/settings
// @desc    Toggle M-Pesa environment between sandbox and production (admin-only)
router.put('/settings', mpesaController.updateSettings);

module.exports = router;
