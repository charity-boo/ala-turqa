import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Fetch customer profile document from Firestore 'users' collection
 */
export const fetchUserProfile = async (uid) => {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Create or update customer profile in Firestore
 */
export const saveUserProfile = async (uid, data) => {
  if (!uid) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

/**
 * Fetch orders placed by the customer (matching userId or email)
 */
export const fetchUserOrders = async (uid, email) => {
  if (!uid && !email) return [];
  try {
    const ordersRef = collection(db, 'orders');
    const orderMap = new Map();

    // Query by userId if present
    if (uid) {
      const qUser = query(ordersRef, where('userId', '==', uid));
      const userSnaps = await getDocs(qUser);
      userSnaps.forEach((docSnap) => {
        orderMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
      });
    }

    // Query by email if present
    if (email) {
      const qEmail = query(ordersRef, where('email', '==', email));
      const emailSnaps = await getDocs(qEmail);
      emailSnaps.forEach((docSnap) => {
        orderMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
      });
    }

    // Convert map to array and sort by createdAt descending
    const ordersList = Array.from(orderMap.values());
    ordersList.sort((a, b) => {
      const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return ordersList;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};
