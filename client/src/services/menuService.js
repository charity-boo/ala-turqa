import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  limit
} from "firebase/firestore";
import { db } from "./firebase";
import { seedMenuDatabase } from "../utils/seedData";
import { generateSlug } from "../utils/idGenerator";

const COLLECTION_NAME = "menu";

let initPromise = null;

const ensureInitialized = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const menuRef = collection(db, COLLECTION_NAME);
        const q = query(menuRef, limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          console.log("Menu collection empty. Auto-seeding initial data...");
          await seedMenuDatabase();
        }
      } catch (error) {
        console.error("Error ensuring initialization:", error);
        initPromise = null; // Allow retry on failure
      }
    })();
  }
  return initPromise;
};

export const getAllMenuItems = async () => {
  try {
    await ensureInitialized();
    const menuRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(menuRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting menu items: ", error);
    throw error;
  }
};

export const getMenuItemById = async (id) => {
  try {
    await ensureInitialized();
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting menu item: ", error);
    throw error;
  }
};

export const getFeaturedItems = async () => {
  try {
    await ensureInitialized();
    const menuRef = collection(db, COLLECTION_NAME);
    const q = query(menuRef, where("featured", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting featured items: ", error);
    throw error;
  }
};

export const getItemsByCategory = async (category) => {
  try {
    await ensureInitialized();
    const menuRef = collection(db, COLLECTION_NAME);
    const q = query(menuRef, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting items by category: ", error);
    throw error;
  }
};

export const searchMenuItems = async (searchTerm) => {
  try {
    await ensureInitialized();
    const menuRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(menuRef);
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (!searchTerm) return items;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerSearchTerm) || 
      (item.description && item.description.toLowerCase().includes(lowerSearchTerm))
    );
  } catch (error) {
    console.error("Error searching menu items: ", error);
    throw error;
  }
};

export const createMenuItem = async (data) => {
  try {
    const slug = data.name ? generateSlug(data.name) : `menu-${Date.now()}`;
    const docRef = doc(db, COLLECTION_NAME, slug);
    const newData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(docRef, newData);
    return { id: slug, ...newData };
  } catch (error) {
    console.error("Error creating menu item: ", error);
    throw error;
  }
};

export const updateMenuItem = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error("Error updating menu item: ", error);
    throw error;
  }
};

export const deleteMenuItem = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting menu item: ", error);
    throw error;
  }
};
