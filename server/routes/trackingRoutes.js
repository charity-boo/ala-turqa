const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { db } = require('../config/firebase');

// Rate limit: max 20 tracking requests per IP per 10 minutes
const trackingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { error: 'Too many tracking requests from this IP, please try again after 10 minutes.' }
});

router.get('/:trackingId', trackingLimiter, async (req, res) => {
  try {
    const { trackingId } = req.params;
    
    let orderDoc;
    let data;

    // ONLY search by trackingId field. Do NOT fallback to Document ID.
    const snapshot = await db.collection('orders').where('trackingId', '==', trackingId).limit(1).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    orderDoc = snapshot.docs[0];
    data = orderDoc.data();
    
    // Whitelist safe public fields
    const safeData = {
      orderNumber: data.orderNumber || orderDoc.id.slice(-6).toUpperCase(),
      status: data.status || 'new',
      statusHistory: data.statusHistory || [],
      deliveryMethod: data.deliveryMethod || 'Delivery',
      deliveryProvider: data.deliveryProvider || null,
      paymentMethod: data.paymentMethod || 'M-Pesa',
      paymentStatus: data.paymentStatus || 'pending',
      total: data.total || 0,
      customerName: data.customerName ? data.customerName.split(' ')[0] : 'Customer',
    };
    
    res.status(200).json(safeData);
  } catch (error) {
    console.error('Tracking endpoint error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
