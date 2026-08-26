const { db } = require('../config/firebase');
const crypto = require('crypto');

const generateTrackingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous chars
  let result = 'AT-';
  const array = new Uint8Array(8);
  crypto.webcrypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
};

// Check for collisions (very rare but good practice)
const getUniqueTrackingId = async () => {
  let isUnique = false;
  let trackingId = '';
  let attempts = 0;
  
  while (!isUnique && attempts < 5) {
    trackingId = generateTrackingId();
    const snapshot = await db.collection('orders').where('trackingId', '==', trackingId).limit(1).get();
    if (snapshot.empty) {
      isUnique = true;
    }
    attempts++;
  }
  
  if (!isUnique) {
    throw new Error('Failed to generate a unique tracking ID');
  }
  return trackingId;
};

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Ensure the client cannot set the tracking ID or force a paid status
    if (orderData.paymentStatus === 'paid' || orderData.paymentStatus === 'completed' || orderData.status === 'completed') {
       return res.status(403).json({ error: 'Invalid order status payload' });
    }

    // Generate internal ID (keep existing format for M-Pesa compatibility)
    let customId = `order-${Date.now()}`;
    if (orderData.items && orderData.items.length > 0) {
      const firstItem = orderData.items.find(item => item && (item.name || item.itemName));
      const firstItemName = String(firstItem?.name || firstItem?.itemName || 'order')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      const shortName = firstItemName.substring(0, 20);
      customId = `${shortName}-${Date.now()}`;
    }

    const trackingId = await getUniqueTrackingId();

    const newOrderData = {
      ...orderData,
      trackingId,
      status: 'pending',
      orderStatus: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
        },
      ],
      source: 'website',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = db.collection('orders').doc(customId);
    await docRef.set(newOrderData);

    res.status(201).json({ id: customId, trackingId, ...newOrderData });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createOrder
};
