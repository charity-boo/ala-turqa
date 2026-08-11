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
    { nameQuery: 'Full Chicken', file: 'full chicken.jpg', exact: true },
    { nameQuery: 'Full Chicken + Fries', file: 'full chicken with fries.jpeg' },
    { nameQuery: 'Full Chicken + Rice or Fries + Salad + 1Lt Soda', file: 'full chicken with fries.jpeg' },
    { nameQuery: 'Half Chicken', file: 'half chicken.jpg', exact: true },
    { nameQuery: 'Half Chicken + Fries', file: 'half chicken with fries .jpg' },
    { nameQuery: 'Half Chicken + Rice or Fries + Salad + 500ml Soda', file: 'half chicken with fries .jpg' }
  ];

  for (const map of mapping) {
    let match;
    if (map.exact) {
      match = items.find(i => i.name.toLowerCase() === map.nameQuery.toLowerCase());
    } else {
      match = items.find(i => i.name.toLowerCase().includes(map.nameQuery.toLowerCase()));
    }
    
    // If not found by includes, try falling back to just finding the words in the name
    if (!match && !map.exact) {
      const words = map.nameQuery.split(' + ').map(w => w.trim().toLowerCase());
      match = items.find(i => {
        const lowerName = i.name.toLowerCase();
        return words.every(w => lowerName.includes(w));
      });
    }

    if (match) {
      try {
        const imageUrl = await getDownloadUrl(map.file);
        await db.collection('menu').doc(match.id).update({
          image: imageUrl,
          imageUrl: imageUrl
        });
        console.log(`Updated ${match.name} with ${map.file}`);
      } catch (e) {
        console.error(`Failed to update ${match.name}: ${e.message}`);
      }
    } else {
      console.log(`Item not found for query '${map.nameQuery}'`);
    }
  }

  process.exit(0);
}
run();
