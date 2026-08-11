const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
const router = express.Router();
router.use('/payment/mpesa', require('./routes/mpesaRoutes'));
router.get('/health', (req, res) => {
  res.json({ status: 'Ala Turqa API running' });
});

// Handle both Cloud Functions direct invocations (which strip /api) 
// and Firebase Hosting rewrites (which preserve /api)
app.use('/', router);
app.use('/api', router);

exports.api = functions.runWith({
  secrets: [
    "MPESA_CONSUMER_KEY",
    "MPESA_CONSUMER_SECRET",
    "MPESA_SHORTCODE",
    "MPESA_PASSKEY",
    "MPESA_TRANSACTION_TYPE",
    "MPESA_CALLBACK_URL",
    "MPESA_ENV"
  ]
}).https.onRequest(app);
