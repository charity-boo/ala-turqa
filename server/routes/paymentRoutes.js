const express = require('express');
const router = express.Router();
const axios = require('axios');

const CLOUD_FUNCTIONS_URL = process.env.CLOUD_FUNCTIONS_URL || 'https://us-central1-ala-turqa.cloudfunctions.net/api';

// Forward all payment requests (/api/payment/mpesa, /api/payment/mpesa/settings, etc.) to Cloud Functions backend
router.all('/*', async (req, res) => {
  try {
    const targetUrl = `${CLOUD_FUNCTIONS_URL}/payment${req.url}`;
    const headers = { ...req.headers };
    delete headers.host;

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers,
      validateStatus: () => true
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Payment Proxy Error:", error.message);
    res.status(502).json({ error: "Payment service proxy error" });
  }
});

module.exports = router;
