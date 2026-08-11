import { getFirestore } from 'firebase-admin/firestore';
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
initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

async function run() {
  console.log("Scanning and sanitizing the menu collection...");
  try {
    const snapshot = await db.collection('menu').get();
    
    let fixCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const isPizza = data.category === 'pizzas' || data.category === 'Pizza & Pide' || (data.name && data.name.toLowerCase().includes('pizza'));
      
      let needsUpdate = false;
      let updates = {};

      // Fix NaN prices
      if (Number.isNaN(data.price)) {
        updates.price = data.smallPrice || 0;
        needsUpdate = true;
      }

      // If it's a pizza and price is a string like "500/700", we should convert it to an integer
      // so the admin dashboard input type="number" doesn't break
      if (isPizza && typeof data.price === 'string' && data.price.includes('/')) {
        const parts = data.price.split('/');
        updates.price = Number(parts[0].trim()) || 0;
        needsUpdate = true;
      }

      if (Number.isNaN(data.smallPrice)) {
        updates.smallPrice = updates.price || data.price || 0;
        needsUpdate = true;
      }
      
      if (Number.isNaN(data.mediumPrice)) {
        updates.mediumPrice = updates.price || data.price || 0;
        needsUpdate = true;
      }

      if (typeof data.displayPrice === 'string' && data.displayPrice.toLowerCase().includes('nan')) {
        updates.displayPrice = `${updates.smallPrice || data.smallPrice}/${updates.mediumPrice || data.mediumPrice}`;
        needsUpdate = true;
      }
      
      if (!data.displayPrice && isPizza && data.smallPrice && data.mediumPrice && data.smallPrice !== data.mediumPrice) {
        updates.displayPrice = `${data.smallPrice}/${data.mediumPrice}`;
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Fixing corrupted item: ${doc.id} (${data.name})`);
        console.log(`Updates:`, updates);
        await db.collection('menu').doc(doc.id).update(updates);
        fixCount++;
      }
    }

    console.log(`Sanitization complete. Fixed ${fixCount} items.`);

  } catch (error) {
    console.error("Error during database cleanup:", error);
  }

  process.exit(0);
}

run();
