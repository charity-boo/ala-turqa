import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'reviews';

export const getReviews = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to load reviews. Please try again later.", { cause: error });
  }
};

export const addReview = async (reviewData) => {
  try {
    const newReview = {
      ...reviewData,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newReview);
    return { id: docRef.id, ...newReview };
  } catch (error) {
    console.error("Error adding review:", error);
    throw new Error("Failed to submit review. Please try again.", { cause: error });
  }
};

export const deleteReview = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review. Please try again.", { cause: error });
  }
};
