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
    token = require('crypto').randomUUID();
    await file.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } });
  }
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${token}`;
}

async function run() {
  const snapshot = await db.collection('menu').get();
  const items = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));

  const fancyOmelette = items.find(i => i.name === 'Omelette (Cheese / Mushroom / Spanish)');
  const scrambledEggs = items.find(i => i.name === 'Scrambled Eggs');

  if (fancyOmelette) {
    try {
      const imageUrl = await getDownloadUrl('omelette (cheesemushroomspanish).jpeg');
      await db.collection('menu').doc(fancyOmelette.id).update({
        image: imageUrl,
        imageUrl: imageUrl
      });
      console.log(`Updated ${fancyOmelette.name} successfully.`);
    } catch (e) {
      console.error("Failed to update fancy omelette image:", e.message);
    }
  }

  if (scrambledEggs) {
    try {
      const imageUrl = await getDownloadUrl('scrambled eggs.jpeg');
      await db.collection('menu').doc(scrambledEggs.id).update({
        image: imageUrl,
        imageUrl: imageUrl
      });
      console.log(`Updated ${scrambledEggs.name} successfully.`);
    } catch (e) {
      console.error("Failed to update scrambled eggs image:", e.message);
    }
  }

  process.exit(0);
}
run();
