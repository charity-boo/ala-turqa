const express = require('express');
const router = express.Router();
const mpesaController = require('../controllers/mpesaController');

// @route   POST /api/payment/mpesa
// @desc    Initiate an M-Pesa STK Push
router.post('/', mpesaController.initiateStkPush);

// @route   POST /api/payment/mpesa/callback
// @desc    Handle Safaricom M-Pesa callback
router.post('/callback', mpesaController.handleCallback);

module.exports = router;
