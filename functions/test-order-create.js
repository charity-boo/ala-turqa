const admin = require('firebase-admin');
require('dotenv').config({ path: '../server/.env' });

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

async function createTestOrder() {
  const orderId = `TEST-ORDER-${Date.now()}`;
  const orderData = {
    orderNumber: orderId,
    customerName: "Automated Test User",
    email: "aksan.kenya@gmail.com",
    phone: "0712345678",
    deliveryMethod: "Delivery",
    paymentMethod: "M-Pesa",
    subtotal: 500,
    deliveryFee: 100,
    total: 600,
    items: [
      { itemName: "Test Burger", quantity: 2, price: 250 }
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: "pending",
    isTest: true
  };

  try {
    console.log(`Creating test order ${orderId}...`);
    await db.collection('orders').doc(orderId).set(orderData);
    console.log(`✅ Test order ${orderId} created successfully in production Firestore.`);
  } catch (error) {
    console.error("❌ Error creating test order:", error);
  }
}

createTestOrder();
