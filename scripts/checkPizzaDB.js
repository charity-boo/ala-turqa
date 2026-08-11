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
  const pizzas = snapshot.docs.map(d => ({ id: d.id, ...d.data() })).filter(i => 
    i.category === 'pizzas' || 
    i.category === 'Pizza & Pide' || 
    (i.name && i.name.toLowerCase().includes('pizza')) || 
    (i.category && i.category.toLowerCase().includes('pizza'))
  );

  console.log(`Found ${pizzas.length} pizzas.`);
  for (const p of pizzas) {
    console.log(`---`);
    console.log(`Name: ${p.name}`);
    console.log(`Price: ${p.price} (${typeof p.price})`);
    console.log(`SmallPrice: ${p.smallPrice} (${typeof p.smallPrice})`);
    console.log(`MediumPrice: ${p.mediumPrice} (${typeof p.mediumPrice})`);
    console.log(`DisplayPrice: ${p.displayPrice} (${typeof p.displayPrice})`);
  }
}

run().catch(console.error).then(() => process.exit(0));
