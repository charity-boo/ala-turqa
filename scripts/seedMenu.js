import { initializeApp, deleteApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import dotenv from "dotenv";
import initialMenuItems from "../seedData/menuData.js";

// 1. Load environment variables
dotenv.config();

// 2. Define the required environment variables
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID"
];

// 3. Verify the environment variables are loaded correctly
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ ERROR: Missing required Firebase environment variables:");
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error("\nPlease check your root .env file and ensure these variables are defined.");
  process.exit(1);
}

// 4. Initialize Firebase using these variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedMenu() {
  console.log("Starting menu seeding process...\n");
  
  const menuCollection = collection(db, "menu");
  let addedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const item of initialMenuItems) {
    try {
      // Check if item already exists by name
      const q = query(menuCollection, where("name", "==", item.name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { price: item.price, description: item.description, category: item.category });
        console.log(`✓ Updated existing ${item.name}`);
        skippedCount++;
        continue; // Skip adding new doc
      }

      // Add serverTimestamp and updatedAt
      const finalItem = {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: null
      };

      // Upload to Firestore
      await addDoc(menuCollection, finalItem);
      console.log(`✓ Added ${item.name}`);
      addedCount++;

    } catch (error) {
      console.error(`❌ Failed to add ${item.name}:`, error.message);
      failedCount++;
    }
  }

  console.log("\nUpload complete:");
  console.log(`Added: ${addedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Failed: ${failedCount}`);

  // Cleanly close the Firebase app connection
  await deleteApp(app);
  process.exit(0);
}

// Execute the seeding process
seedMenu().catch(err => {
  console.error("❌ Seeding completely failed:", err);
  process.exit(1);
});
