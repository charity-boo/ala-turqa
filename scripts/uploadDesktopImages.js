import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../server/.env') });

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = getFirestore();
const bucket = getStorage().bucket();

const manualMap = {
  'Ayran .webp': ['ayran'],
  'babaghannush.jpeg': ['baba ghanoush'],
  'banana pudding.jpeg': ['banana pudding'],
  'chicken ceasar salad.jpg': ['chicken caesar salad'],
  'Chicken-Shawarma-Wraps-with-Fries.png': ['shawarma wrap + fries + 350ml soda'],
  'Creme-caramel.webp': ['creme caramel'],
  'falafel.webp': ['falafel'],
  'french fries.jpeg': ['french fries'],
  'fresh juice.jpg': ['fresh juices'],
  'Fried Kibbeh-Recipe.jpeg': ['kebbe fried'],
  'green salad.jpg': ['green salad'],
  'Hummus.jpg': ['hummus'],
  'lemonade.jpeg': ['lemonade'],
  'mashed potatoes.jpg': ['mashed potatoes'],
  'mediterranean salad.jpeg': ['mediterranean salad'],
  'minute maid.jpg': ['minute maid'],
  'mutabbal.jpg': ['mutabbal'],
  'penne Chicken-Mushroom-Alfredo.jpg': ['penne chicken mushroom alfredo'],
  'plain youghurt.jpeg': ['plain youghurt', 'plain yoghurt'],
  'revani.jpg': ['revani'],
  'rice.jpeg': ['rice', 'pilav'],
  'rice pudding.jpg': ['sutlac', 'rice pudding'],
  'sekerpare.jpeg': ['sekerpare'],
  'shawara fries.avif': ['shawarma fries'],
  'shawarma fries and salad.webp': ['shawarma plate + fries or rice + salad + 500ml soda'],
  'shawarma fries and soda.webp': ['shawarma + fries + 350ml soda'],
  'shawarma wrap.jpeg': ['shawarma wrap'],
  'shepherd-salad.jpg': ['shepherd salad'],
  'side salad.jpeg': ['side salad'],
  'Soda 350Ml.jpeg': ['sodas 350ml', 'sodas 350ml / 500ml'],
  'soda 500ml.jpeg': ['sodas 500ml'],
  'spaghetti bolognese.jpeg': ['spaghetti bolognese'],
  'sparkling water.jpeg': ['sparkling water', 'sparkling water 500ml', 'sparkling water 1lt', 'sparkling water 500ml / 1lt'],
  'spinach & feta tagliatelle.jpeg': ['spinach & feta tagliatelle'],
  'still water.webp': ['still water', 'water', 'still water 500ml', 'still water 1lt', 'still water 500ml / 1lt'],
  'Strawberry-Lemonade.jpg': ['strawberry lemonade'],
  'Strawberry-Pudding.webp': ['strawberry pudding'],
  'tonic.jpeg': ['tonic 500ml', 'tonic'],
  'ugali.jpeg': ['ugali']
};

const normalizeName = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9 -]/g, ' ').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
};

async function run() {
  const desktopDir = path.join(process.env.HOME || '/home/chacha', 'Desktop');
  const files = fs.readdirSync(desktopDir).filter(f => f.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i));

  const menuSnapshot = await db.collection('menu').get();
  const menuItems = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  let count = 0;

  for (const filename of files) {
    const filePath = path.join(desktopDir, filename);
    const baseName = path.parse(filename).name;
    const normFile = normalizeName(baseName);
    
    // Find matching items
    let matchedItems = [];

    // Check manual map
    if (manualMap[filename]) {
      const targetNames = manualMap[filename];
      matchedItems = menuItems.filter(i => targetNames.includes(i.name.toLowerCase()));
    } else {
      // Fallback: match by normalized name exactly
      matchedItems = menuItems.filter(i => normalizeName(i.name) === normFile);
    }

    if (matchedItems.length === 0) {
      console.log(`⚠️  No matching menu item found for: ${filename}`);
      continue;
    }

    console.log(`Uploading ${filename}...`);
    const token = crypto.randomUUID();
    const destPath = `menu-images/${filename}`;
    
    await bucket.upload(filePath, {
      destination: destPath,
      metadata: {
        cacheControl: 'public, max-age=31536000',
        metadata: { firebaseStorageDownloadTokens: token }
      }
    });
    
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destPath)}?alt=media&token=${token}`;

    for (const item of matchedItems) {
      await db.collection('menu').doc(item.id).update({
        imageUrl: downloadUrl,
        image: downloadUrl
      });
      console.log(`✅ Linked ${filename} to ${item.name}`);
      count++;
    }
  }
  console.log(`Finished updating ${count} items with new photos!`);
}

run().catch(console.error).then(() => process.exit(0));
