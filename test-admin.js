const admin = require('firebase-admin');
try {
  admin.initializeApp();
  console.log("App initialized.");
  const db = admin.firestore();
  db.collection('orders').limit(1).get().then(snap => {
    console.log("Successfully connected to Firestore! Docs found: " + snap.size);
    process.exit(0);
  }).catch(e => {
    console.error("Firestore error:", e);
    process.exit(1);
  });
} catch(e) {
  console.error("Init error:", e);
  process.exit(1);
}
