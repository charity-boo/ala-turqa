import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined
};

if (!serviceAccount.privateKey) {
  console.error("Missing FIREBASE_PRIVATE_KEY");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const imagesToUpload = [
  { file: "chicken-shish.jpg", name: "Chicken Shish" },
  { file: "lamb-shish.jpg", name: "Lamb Shish" },
  { file: "shawarma.jpg", name: "Shawarma Wrap" },
  { file: "hummus.jpg", name: "Hummus" }
];

async function uploadAndSync() {
  console.log("Starting Admin image upload and Firestore sync...");
  
  for (const item of imagesToUpload) {
    try {
      const filePath = path.resolve(process.cwd(), "../client/public/menu-images", item.file);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        continue;
      }
      
      const destination = `menu-images/${Date.now()}_${item.file}`;
      console.log(`Uploading ${item.file}...`);
      
      const [uploadedFile] = await bucket.upload(filePath, {
        destination: destination,
        metadata: {
          contentType: 'image/jpeg',
        }
      });
      
      await uploadedFile.makePublic();
      const downloadURL = `https://storage.googleapis.com/${bucket.name}/${destination}`;
      
      console.log(`✓ Uploaded ${item.file} -> ${downloadURL}`);
      
      // Update Firestore
      const menuRef = db.collection("menu");
      const querySnapshot = await menuRef.where("name", "==", item.name).get();
      
      if (querySnapshot.empty) {
        console.log(`⚠️ Document with name "${item.name}" not found in Firestore.`);
      } else {
        for (const docSnapshot of querySnapshot.docs) {
          await docSnapshot.ref.update({ image: downloadURL });
          console.log(`✓ Updated Firestore document for ${item.name}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${item.file}:`, error);
    }
  }
  
  console.log("Process complete.");
  process.exit(0);
}

uploadAndSync();
