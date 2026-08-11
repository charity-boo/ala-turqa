import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../server/.env') });

// 2. Initialize Firebase Admin
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
    initializeApp({
      credential: cert(serviceAccount)
    });
  } catch (e) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT from server/.env:", e);
    process.exit(1);
  }
} else {
  // Falls back to application default credentials
  console.log("Warning: No explicit credentials found, falling back to application default.");
  initializeApp();
}

const db = getFirestore();

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
};

const generateOrderNumber = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORDER-${yyyy}${mm}${dd}-${random}`;
};

const generatePaymentNumber = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PAY-${yyyy}${mm}${dd}-${random}`;
};

async function migrate() {
  console.log("Starting Migration with Firebase Admin...");
  const oldMenuIdToSlug = {}; // Map to track old ID to new Slug
  
  // ==========================================
  // PHASE 1: Migrate Menu Items
  // ==========================================
  console.log("\n--- Migrating Menu Items ---");
  const menuSnapshot = await db.collection("menu").get();
  for (const itemDoc of menuSnapshot.docs) {
    const data = itemDoc.data();
    if (!data.name) continue;
    
    const newSlug = generateSlug(data.name);
    
    // If the ID is already a slug, skip
    if (itemDoc.id === newSlug) {
      oldMenuIdToSlug[itemDoc.id] = newSlug; // Track anyway
      continue;
    }
    
    console.log(`Migrating menu: ${data.name} (${itemDoc.id} -> ${newSlug})`);
    
    // Write new document
    await db.collection("menu").doc(newSlug).set(data);
    // Delete old document
    await db.collection("menu").doc(itemDoc.id).delete();
    
    oldMenuIdToSlug[itemDoc.id] = newSlug;
  }

  // ==========================================
  // PHASE 2: Migrate Orders
  // ==========================================
  console.log("\n--- Migrating Orders ---");
  const ordersSnapshot = await db.collection("orders").get();
  for (const orderDoc of ordersSnapshot.docs) {
    const data = orderDoc.data();
    let needsUpdate = false;
    const updateData = {};
    
    if (!data.orderNumber) {
      updateData.orderNumber = generateOrderNumber();
      needsUpdate = true;
    }
    
    // Update items to have menuSlug
    if (data.items && Array.isArray(data.items)) {
      let itemsChanged = false;
      const newItems = data.items.map(item => {
        const menuId = item.productId || item.menuId || item.id; // handle different legacy formats
        const menuSlug = oldMenuIdToSlug[menuId] || menuId || generateSlug(item.name || 'unknown');
        
        if (!item.menuSlug || item.menuSlug !== menuSlug) {
          itemsChanged = true;
          return {
            ...item,
            menuId: menuId,
            menuSlug: menuSlug,
            itemName: item.name || item.itemName || 'Unknown Item'
          };
        }
        return item;
      });
      
      if (itemsChanged) {
        updateData.items = newItems;
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      console.log(`Updating order: ${orderDoc.id} (Order #: ${updateData.orderNumber || data.orderNumber})`);
      await db.collection("orders").doc(orderDoc.id).update(updateData);
    }
  }

  // ==========================================
  // PHASE 3: Migrate Payments
  // ==========================================
  console.log("\n--- Migrating Payments ---");
  const paymentsSnapshot = await db.collection("payments").get();
  for (const paymentDoc of paymentsSnapshot.docs) {
    const data = paymentDoc.data();
    
    if (!data.paymentNumber) {
      const paymentNumber = generatePaymentNumber();
      console.log(`Updating payment: ${paymentDoc.id} (Payment #: ${paymentNumber})`);
      await db.collection("payments").doc(paymentDoc.id).update({ paymentNumber });
    }
  }

  console.log("\nMigration completed successfully.");
}

migrate().catch(console.error);
