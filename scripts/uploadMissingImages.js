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
  'Fried Kibbeh-Recipe.jpeg': ['fried kibbeh'],
  'Strawberry-Pudding.webp': ['pudding (strawberry)'],
  'babaghannush.jpeg': ['babaghannush'],
  'banana pudding.jpeg': ['pudding (banana)'],
  'shepherd-salad.jpg': ["shepherd's salad"]
};

async function run() {
  const desktopDir = path.join(process.env.HOME || '/home/chacha', 'Desktop');
  const menuSnapshot = await db.collection('menu').get();
  const menuItems = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  for (const filename of Object.keys(manualMap)) {
    const filePath = path.join(desktopDir, filename);
    if (!fs.existsSync(filePath)) continue;

    const targetNames = manualMap[filename];
    const matchedItems = menuItems.filter(i => targetNames.includes(i.name.toLowerCase()));

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
    }
  }
}

run().catch(console.error).then(() => process.exit(0));
