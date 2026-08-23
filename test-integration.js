import admin from 'firebase-admin';

try {
  admin.initializeApp();
  console.log("Admin initialized via ADC.");
  const db = admin.firestore();
  
  // Test access
  const snap = await db.collection('orders').limit(1).get();
  console.log(`Successfully connected. Found ${snap.size} orders.`);
  
  // Clean up
  process.exit(0);
} catch (e) {
  console.error("Failed to initialize admin:", e.message);
  process.exit(1);
}
