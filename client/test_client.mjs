import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRAny7xJtaJpnvdtmb1bIFNIJT-QxBqbQ",
  authDomain: "ala-turqa.firebaseapp.com",
  databaseURL: "https://ala-turqa-default-rtdb.firebaseio.com",
  projectId: "ala-turqa",
  storageBucket: "ala-turqa.firebasestorage.app",
  messagingSenderId: "934053091762",
  appId: "1:934053091762:web:176e20eae0f3d46d3e2cab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const API_URL = "https://us-central1-ala-turqa.cloudfunctions.net/api";

async function runTests() {
  console.log("--- End-to-End M-Pesa Test via Client SDK ---");

  // 1. Create Order
  const orderId = "test-order-" + Date.now();
  const orderRef = doc(db, "orders", orderId);
  await setDoc(orderRef, {
    orderNumber: "TEST-E2E",
    total: 100,
    paymentStatus: "pending",
    source: "test-script"
  });
  console.log("Created Order:", orderId);

  // 2. Initiate STK Push
  console.log("Initiating STK Push...");
  const stkRes = await fetch(`${API_URL}/payment/mpesa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, phone: "254708374149" })
  });
  const stkData = await stkRes.json();
  console.log("STK Push Response:", stkData);

  if (!stkData.checkoutRequestId) {
    console.error("Failed to get CheckoutRequestID");
    process.exit(1);
  }

  console.log("--- Test Complete ---");
  process.exit(0);
}

runTests().catch(console.error);
