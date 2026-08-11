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
  const items = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
  
  console.log("--- Samosa Items ---");
  items.filter(i => i.name.toLowerCase().includes('samosa')).forEach(i => console.log(i));
  
  console.log("--- Pogaca Items ---");
  items.filter(i => i.name.toLowerCase().includes('pogaca')).forEach(i => console.log(i));
  
  process.exit(0);
}
run();
