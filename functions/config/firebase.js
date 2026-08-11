const admin = require('firebase-admin');
require('dotenv').config();

if (!admin.apps.length) {
  // If FIREBASE_SERVICE_ACCOUNT is provided as a stringified JSON in .env, use it
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT, falling back to default:", e);
      admin.initializeApp();
    }
  } else {
    // Falls back to application default credentials
    admin.initializeApp();
  }
}

const db = admin.firestore();

module.exports = {
  admin,
  db
};
