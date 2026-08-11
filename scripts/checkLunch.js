import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../server/.env') });

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
});

const db = getFirestore();

async function checkLunch() {
  const snapshot = await db.collection('menu').where('available', '==', true).get();
  
  console.log("Active categories in database:");
  const categories = new Set();
  snapshot.docs.forEach(doc => {
      categories.add(doc.data().category);
  });
  
  Array.from(categories).sort().forEach(c => console.log(`- ${c}`));

  console.log("\nChecking for any items with 'Lunch' in the category...");
  snapshot.docs.forEach(doc => {
    if (doc.data().category.toLowerCase().includes('lunch')) {
      console.log(`Found: ${doc.data().name} in category ${doc.data().category}`);
    }
  });
  console.log("Done checking.");
  process.exit(0);
}

checkLunch();
