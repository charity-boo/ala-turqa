import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "menu";

export const getAllMenuItems = async () => {
  try {
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
    const menuRef = collection(db, COLLECTION_NAME);
    const newData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(menuRef, newData);
    return { id: docRef.id, ...newData };
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
