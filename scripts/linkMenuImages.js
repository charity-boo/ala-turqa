import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

// Initialize Firebase Admin
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

const normalizeName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, ' ') // replace special chars with spaces instead of removing to preserve boundaries
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // collapse multiple hyphens
};

async function run() {
  console.log('Starting linkMenuImages script...\n');

  let processedCount = 0;
  let linkedCount = 0;
  let alreadyLinkedCount = 0;
  let missingCount = 0;
  let errorCount = 0;

  try {
    // 1. Fetch all menu items
    const menuSnapshot = await db.collection('menu').get();
    const menuItems = menuSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 2. Fetch all images in the root of the bucket
    const [files] = await bucket.getFiles();
    const imageMap = {}; // { 'chicken-shish': File }
    
    files.forEach(file => {
      // file.name looks like 'chicken-shish.jpg'
      const baseName = path.basename(file.name);
      // Ignore the folder itself if it comes up
      if (baseName) {
        const nameWithoutExt = path.parse(baseName).name;
        // Normalize file name just in case
        imageMap[normalizeName(nameWithoutExt)] = file;
      }
    });

    // 3. Process each menu item
    for (const item of menuItems) {
      processedCount++;
      try {
        const normalizedItemName = normalizeName(item.name);
        const matchingFile = imageMap[normalizedItemName];

        if (matchingFile) {
          // Check if already validly linked (we now want to force update to pick up new images)
          const isInvalidImageUrl = !item.imageUrl || typeof item.imageUrl !== 'string' || !item.imageUrl.startsWith('http');
          const isInvalidImage = !item.image || typeof item.image !== 'string' || !item.image.startsWith('http');
          
          if (!isInvalidImageUrl && !isInvalidImage) {
            alreadyLinkedCount++;
            // continue; // Commented out to force update of newly uploaded files
          }

          // Generate download URL
          const [metadata] = await matchingFile.getMetadata();
          let downloadToken = '';
          if (metadata && metadata.metadata && metadata.metadata.firebaseStorageDownloadTokens) {
            downloadToken = metadata.metadata.firebaseStorageDownloadTokens.split(',')[0];
          } else {
             // Generate a token if none exists
             downloadToken = crypto.randomUUID();
             await matchingFile.setMetadata({
                 metadata: {
                     firebaseStorageDownloadTokens: downloadToken
                 }
             });
          }

          const bucketName = bucket.name;
          const filePath = encodeURIComponent(matchingFile.name);
          const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filePath}?alt=media&token=${downloadToken}`;

          // Update Firestore
          await db.collection('menu').doc(item.id).update({
            imageUrl: downloadUrl,
            image: downloadUrl
          });

          console.log(`✓ ${item.name} linked successfully`);
          linkedCount++;

        } else {
          console.log(`⚠ No image found for ${item.name}`);
          missingCount++;
        }
      } catch (err) {
        console.error(`✗ Error processing ${item.name}:`, err.message);
        errorCount++;
      }
    }

  } catch (error) {
    console.error('Fatal error during execution:', error);
  } finally {
    console.log('\n---------------------------------');
    console.log(`Menu items processed: ${processedCount}`);
    console.log(`Images linked: ${linkedCount}`);
    console.log(`Already linked: ${alreadyLinkedCount}`);
    console.log(`Missing images: ${missingCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('---------------------------------');
    process.exit(0);
  }
}

run();
