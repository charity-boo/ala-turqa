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
  const snapshot = await db.collection('menu').get();
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const omelette = items.find(i => i.id === 'omelette' || (i.name && i.name.toLowerCase() === 'omelette'));
  
  if (omelette) {
    console.log(`Found ${omelette.name} (${omelette.id}). Renaming to 'Omelette Plain'...`);
    
    // We will create the new document with slug 'omelette-plain'
    const newSlug = 'omelette-plain';
    const newData = {
      ...omelette,
      name: 'Omelette Plain',
      updatedAt: new Date()
    };
    
    // Remove the old ID from the data if it accidentally got included
    delete newData.id;

    // Create new doc
    await db.collection('menu').doc(newSlug).set(newData);
    console.log(`Created new document with ID: ${newSlug}`);
    
    // If the old ID is different from the new one, delete the old one
    if (omelette.id !== newSlug) {
      await db.collection('menu').doc(omelette.id).delete();
      console.log(`Deleted old document with ID: ${omelette.id}`);
    }
    
    console.log("Successfully renamed Omelette.");
  } else {
    console.log("Omelette not found in the menu!");
  }

  process.exit(0);
}

run();
