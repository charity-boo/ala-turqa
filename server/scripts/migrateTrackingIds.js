require('dotenv').config();
const { db } = require('../config/firebase');
const crypto = require('crypto');

const generateTrackingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'AT-';
  const array = new Uint8Array(8);
  crypto.webcrypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
};

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

const migrate = async () => {
  console.log('Starting migration to generate trackingIds for legacy orders...');
  
  try {
    const ordersSnapshot = await db.collection('orders').get();
    let count = 0;

    for (const doc of ordersSnapshot.docs) {
      const data = doc.data();
      if (!data.trackingId) {
        const trackingId = await getUniqueTrackingId();
        await doc.ref.update({ trackingId });
        console.log(`Updated order ${doc.id} with trackingId ${trackingId}`);
        count++;
      }
    }

    console.log(`Migration complete. Updated ${count} orders.`);
  } catch (err) {
    console.error('Migration failed:', err);
  }
};

migrate();
