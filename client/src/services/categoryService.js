import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import { MENU_CATEGORIES } from '../utils/constants';

const CATEGORY_COLLECTION = 'categories';
const MENU_COLLECTION = 'menu';

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getCategories = async () => {
  const categoriesRef = collection(db, CATEGORY_COLLECTION);
  const categoryQuery = query(categoriesRef, orderBy('sortOrder', 'asc'), limit(200));
  const snapshot = await getDocs(categoryQuery);

  if (!snapshot.empty) {
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  }

  const menuSnapshot = await getDocs(query(collection(db, MENU_COLLECTION), limit(500)));
  const menuCategories = new Set(menuSnapshot.docs.map((docSnap) => docSnap.data()?.category).filter(Boolean));
  const merged = Array.from(new Set([...MENU_CATEGORIES, ...menuCategories]));

  return merged.map((name, index) => ({
    id: toSlug(name),
    name,
    slug: toSlug(name),
    isActive: true,
    sortOrder: index,
    derived: true,
  }));
};

export const createCategory = async ({ name, sortOrder = 0 }) => {
  const slug = toSlug(name);
  const categoriesRef = collection(db, CATEGORY_COLLECTION);
  const q = query(categoriesRef, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    throw new Error('A category with this name already exists.');
  }

  const payload = {
    name,
    slug,
    isActive: true,
    sortOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, CATEGORY_COLLECTION), payload);
  return { id: docRef.id, ...payload };
};

export const updateCategory = async (id, data) => {
  const categoryRef = doc(db, CATEGORY_COLLECTION, id);
  await updateDoc(categoryRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCategorySafely = async (categoryName) => {
  const menuRef = collection(db, MENU_COLLECTION);
  const menuQuery = query(menuRef, where('category', '==', categoryName), limit(1));
  const menuSnapshot = await getDocs(menuQuery);
  if (!menuSnapshot.empty) {
    throw new Error('Category has menu items. Reassign items before deleting.');
  }
};
