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

// Utility to normalize IDs
const normalizeName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

async function run() {
  console.log("Starting Pizza Refactoring...");
  try {
    const snapshot = await db.collection('menu').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const pizzas = items.filter(i => i.category === 'pizzas' || (i.name && i.name.toLowerCase().includes('pizza')) || (i.category && i.category.toLowerCase().includes('pizza')));

    const groups = {}; // { "Margherita Pizza": { items: [], small: null, medium: null } }

    for (const p of pizzas) {
      // Extract base name
      let baseName = p.name
        .replace(/\(small\)/i, '')
        .replace(/\(medium\)/i, '')
        .replace(/\blarge\b/i, '')
        .replace(/\bmedium\b/i, '')
        .replace(/\bsmall\b/i, '')
        .replace(/\(\)/g, '')
        .trim();
        
      // Ensure it has 'Pizza' if it doesn't already? The requirements say:
      // "Keep the original pizza name. Remove any Small, Medium... labels."
      // So we leave it as is.
      // But notice we might have "Beef BBQ" and "Beef BBQ Pizza".
      // Let's just group by the exact extracted baseName.
      
      const lowerName = p.name.toLowerCase();
      let size = 'unknown';
      if (lowerName.includes('small')) size = 'small';
      else if (lowerName.includes('medium')) size = 'medium';
      else if (lowerName.includes('large')) size = 'large';
      
      if (!groups[baseName]) {
        groups[baseName] = { items: [], prices: {} };
      }
      
      groups[baseName].items.push(p);
      if (size !== 'unknown') {
        groups[baseName].prices[size] = p.price;
      } else {
        // Fallback: guess by price or just keep as default
        groups[baseName].prices['default'] = p.price;
      }
    }

    const mergedPizzas = [];
    const deletedDocs = [];
    
    // Now process the groups
    for (const [baseName, group] of Object.entries(groups)) {
      if (group.items.length <= 1) {
        // Only one item, maybe it's already merged or just one size
        // We can still reformat it if it has "Small" in the name, but let's see.
        if (group.items[0].name !== baseName) {
           // We should rename it anyway to remove size
           // But let's check if it actually has sizes to merge
        }
      }
      
      // Let's figure out prices
      const smallPrice = group.prices['small'] || Math.min(...group.items.map(i => i.price));
      const mediumPrice = group.prices['medium'] || Math.max(...group.items.map(i => i.price));
      
      let displayPrice = "";
      if (smallPrice && mediumPrice && smallPrice !== mediumPrice) {
        displayPrice = `${smallPrice}/${mediumPrice}`;
      } else {
        displayPrice = `${smallPrice || mediumPrice || group.items[0].price}`;
      }
      
      // We will use the first item to carry over metadata (image, description, category, etc)
      // Preferably one with an image
      let primaryItem = group.items.find(i => i.image) || group.items[0];
      
      const newSlug = normalizeName(baseName);
      
      const newDoc = {
        ...primaryItem,
        name: baseName,
        price: smallPrice || mediumPrice || group.items[0].price,
        smallPrice: smallPrice,
        mediumPrice: mediumPrice,
        displayPrice: displayPrice
      };
      
      delete newDoc.id; // remove id

      mergedPizzas.push({ newSlug, baseName, newDoc });
      
      // Mark old ones for deletion
      for (const item of group.items) {
        if (item.id !== newSlug) {
          deletedDocs.push(item.id);
        }
      }
    }

    console.log("=== MERGED PIZZAS ===");
    for (const m of mergedPizzas) {
      console.log(`Creating/Updating: ${m.newSlug} -> ${m.baseName} (${m.newDoc.displayPrice})`);
      await db.collection('menu').doc(m.newSlug).set(m.newDoc);
    }
    
    console.log("\n=== DELETED DOCS ===");
    for (const id of deletedDocs) {
      console.log(`Deleting old redundant ID: ${id}`);
      await db.collection('menu').doc(id).delete();
    }
    
    console.log("Refactoring complete.");

  } catch (error) {
    console.error("Error during refactoring:", error);
  }

  process.exit(0);
}

run();
