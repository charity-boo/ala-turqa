import { 
  collection, 
  doc, 
  setDoc,
  updateDoc, 
  getDocs,
  onSnapshot, 
  query, 
  orderBy,
  limit,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "notifications";

/**
 * Subscribe to admin notifications in real-time
 * Limits to the latest 20 notifications.
 */
export const subscribeToNotifications = (callback) => {
  const notificationsRef = collection(db, COLLECTION_NAME);
  // Ordered by newest
  const q = query(
    notificationsRef,
    orderBy("createdAt", "desc"),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(notifications);
  }, (error) => {
    console.error("Error subscribing to notifications:", error);
  });
};

/**
 * Create a new order notification for admins
 */
export const createNotification = async (orderData) => {
  try {
    const notificationId = `notif-${orderData.id}`;
    const docRef = doc(db, COLLECTION_NAME, notificationId);
    
    const notificationData = {
      type: "NEW_ORDER",
      title: "New Order",
      message: `New order #${orderData.orderNumber} received`,
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      recipientRole: "admin",
      isRead: false,
      createdAt: serverTimestamp()
    };
    
    // Use setDoc to be idempotent (if retried, it won't create a duplicate)
    await setDoc(docRef, notificationData);
    return { id: docRef.id, ...notificationData };
  } catch (error) {
    console.error("Error creating notification:", error);
    // Re-throw so caller can handle, or just log. Requirements say:
    // "If notification creation fails, do not cause the customer's order creation to fail... 
    // Log notification errors appropriately."
    // We will handle this in the caller.
    throw error;
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, COLLECTION_NAME, notificationId);
    await updateDoc(notificationRef, {
      isRead: true
    });
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    throw error;
  }
};

/**
 * Mark all unread admin notifications as read
 */
export const markAllNotificationsAsRead = async (notifications) => {
  try {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    // Use writeBatch to update multiple documents
    const batch = writeBatch(db);
    
    unreadNotifications.forEach(notification => {
      const notificationRef = doc(db, COLLECTION_NAME, notification.id);
      batch.update(notificationRef, { isRead: true });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

export const getNotifications = async (limitCount = 100) => {
  const notificationsRef = collection(db, COLLECTION_NAME);
  const q = query(notificationsRef, orderBy("createdAt", "desc"), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
};
