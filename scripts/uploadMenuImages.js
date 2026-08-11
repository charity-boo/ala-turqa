import { initializeApp, deleteApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const imagesToUpload = [
  { file: "chicken-shish.jpg", name: "Chicken Shish" },
  { file: "lamb-shish.jpg", name: "Lamb Shish" },
  { file: "shawarma.jpg", name: "Shawarma Wrap" },
  { file: "hummus.jpg", name: "Hummus" }
];

async function uploadAndSync() {
  console.log("Starting image upload and Firestore sync...");
  
  for (const item of imagesToUpload) {
    try {
      const filePath = path.resolve(process.cwd(), "client/public/menu-images", item.file);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        continue;
      }
      
      const fileBuffer = fs.readFileSync(filePath);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `menu-images/${Date.now()}_${item.file}`);
      
      const metadata = {
        contentType: 'image/jpeg',
      };
      
      console.log(`Uploading ${item.file}...`);
      await uploadBytes(storageRef, fileBuffer, metadata);
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log(`✓ Uploaded ${item.file} -> ${downloadURL}`);
      
      // Update Firestore
      const menuRef = collection(db, "menu");
      const q = query(menuRef, where("name", "==", item.name));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`⚠️ Document with name "${item.name}" not found in Firestore.`);
      } else {
        for (const docSnapshot of querySnapshot.docs) {
          await updateDoc(docSnapshot.ref, { image: downloadURL });
          console.log(`✓ Updated Firestore document for ${item.name}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${item.file}:`, error);
    }
  }
  
  console.log("Process complete.");
  await deleteApp(app);
  process.exit(0);
}

uploadAndSync();
