import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'feedback';

export const getFeedback = async (statusFilter = null, priorityFilter = null) => {
  try {
    let q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    
    // Note: To use multiple where clauses and orderby, Firestore requires composite indexes.
    // For simplicity without requiring the user to build indexes, we might filter client-side if needed,
    // or keep it simple. Let's do simple query and filter client side to avoid index requirement issues.
    const querySnapshot = await getDocs(q);
    let results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (statusFilter && statusFilter !== 'All') {
      results = results.filter(item => item.status === statusFilter);
    }
    if (priorityFilter && priorityFilter !== 'All') {
      results = results.filter(item => item.priority === priorityFilter);
    }

    return results;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw new Error("Failed to load feedback. Please try again later.", { cause: error });
  }
};

export const addFeedback = async (feedbackData) => {
  try {
    const newFeedback = {
      ...feedbackData,
      status: 'pending',
      priority: feedbackData.priority || 'medium',
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newFeedback);
    return { id: docRef.id, ...newFeedback };
  } catch (error) {
    console.error("Error adding feedback:", error);
    throw new Error("Failed to submit feedback. Please try again.", { cause: error });
  }
};

export const updateFeedbackStatus = async (id, status) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status });
    return { id, status };
  } catch (error) {
    console.error("Error updating feedback status:", error);
    throw new Error("Failed to update status.", { cause: error });
  }
};

export const updateFeedbackPriority = async (id, priority) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { priority });
    return { id, priority };
  } catch (error) {
    console.error("Error updating feedback priority:", error);
    throw new Error("Failed to update priority.", { cause: error });
  }
};

export const deleteFeedback = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw new Error("Failed to delete feedback.", { cause: error });
  }
};
