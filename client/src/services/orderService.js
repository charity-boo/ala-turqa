import { 
  collection, 
  doc, 
  setDoc,
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "orders";

/**
 * Subscribe to all orders in real-time
 */
export const subscribeToOrders = (callback) => {
  const ordersRef = collection(db, COLLECTION_NAME);
  // Order by newest first
  const q = query(ordersRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(orders);
  }, (error) => {
    console.error("Error subscribing to orders:", error);
  });
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, COLLECTION_NAME, orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating order ${orderId} status to ${newStatus}:`, error);
    throw error;
  }
};

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  try {
    // Generate a custom ID using the first item's name (if available) and a timestamp
    let customId = `order-${Date.now()}`;
    if (orderData.items && orderData.items.length > 0) {
      const firstItemName = orderData.items[0].name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      // Keep it somewhat short, e.g., max 20 chars of the name
      const shortName = firstItemName.substring(0, 20);
      customId = `${shortName}-${Date.now()}`;
    }

    const docRef = doc(db, COLLECTION_NAME, customId);
    
    const newOrderData = {
      ...orderData,
      orderStatus: 'pending',
      source: 'website',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // We use setDoc since we have a specific ID now
    await setDoc(docRef, newOrderData);
    return { id: docRef.id, ...newOrderData };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

