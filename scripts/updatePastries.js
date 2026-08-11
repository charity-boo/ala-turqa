import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, cert } from 'firebase-admin/app';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};
initializeApp({ 
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET 
});

const db = getFirestore();
const bucket = getStorage().bucket();

async function getDownloadUrl(filename) {
  const file = bucket.file(filename);
  const [metadata] = await file.getMetadata();
  let token = '';
  if (metadata && metadata.metadata && metadata.metadata.firebaseStorageDownloadTokens) {
    token = metadata.metadata.firebaseStorageDownloadTokens.split(',')[0];
  } else {
    // We assume token exists since linkMenuImages generated it, or we skip.
    // If not, we can generate a simple one.
    token = require('crypto').randomUUID();
    await file.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } });
  }
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${token}`;
}

async function run() {
  console.log("Deleting 'samosa' and 'pogaca'...");
  await db.collection('menu').doc('samosa').delete();
  await db.collection('menu').doc('pogaca').delete();
  console.log("Deleted.");

  console.log("Updating remaining items with images...");
  try {
    const samosaUrl = await getDownloadUrl('Samosa.jpg');
    await db.collection('menu').doc('samosa-minced-beef-chicken-feta-coriander').update({
      image: samosaUrl,
      imageUrl: samosaUrl
    });
    console.log("Updated Samosa with Minced Beef.");
  } catch (e) {
    console.error("Failed to update samosa image:", e.message);
  }

  try {
    const pogacaUrl = await getDownloadUrl('Pogaca.jpg');
    await db.collection('menu').doc('pogaca-potato-minced-beef-mozerella').update({
      image: pogacaUrl,
      imageUrl: pogacaUrl
    });
    console.log("Updated Pogaca with Potato.");
  } catch (e) {
    console.error("Failed to update pogaca image:", e.message);
  }

  process.exit(0);
}

run();
