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

  const mapping = [
    { nameQuery: 'chicken ceasar salad', file: 'chicken ceasar salad.jpg' },
    { nameQuery: 'chicken caesar salad', file: 'chicken ceasar salad.jpg' }, // in case of spelling differences
    { nameQuery: 'green salad', file: 'green salad.jpg' },
    { nameQuery: 'mediterranean salad', file: 'mediterranean salad.jpeg' },
    { nameQuery: 'shepherd', file: 'shepherd-salad.jpg' },
    { nameQuery: 'penne', file: 'penne Chicken-Mushroom-Alfredo.jpg' },
    { nameQuery: 'alfredo', file: 'penne Chicken-Mushroom-Alfredo.jpg' },
    { nameQuery: 'spaghetti bolognese', file: 'spaghetti bolognese.jpeg' },
    { nameQuery: 'spinach & feta tagliatelle', file: 'spinach & feta tagliatelle.jpeg' }
  ];

  for (const map of mapping) {
    const item = items.find(i => i.name.toLowerCase().includes(map.nameQuery.toLowerCase()));
    
    if (item) {
      try {
        const imageUrl = await getDownloadUrl(map.file);
        await db.collection('menu').doc(item.id).update({
          image: imageUrl,
          imageUrl: imageUrl
        });
        console.log(`Updated ${item.name} with ${map.file}`);
      } catch (e) {
        console.error(`Failed to update ${item.name}: ${e.message}`);
      }
    }
  }

  process.exit(0);
}
run();
