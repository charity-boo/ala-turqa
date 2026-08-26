import { 
  collection, 
  doc, 
  setDoc,
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  limit,
  where,
  getDocs,
  getCountFromServer,
  arrayUnion
} from "firebase/firestore";
import { db } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getKenyaMidnight = () => {
  const now = new Date();
  const kenyaFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Nairobi', year: 'numeric', month: 'numeric', day: 'numeric' });
  const [month, day, year] = kenyaFormatter.format(now).split('/');
  const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00+03:00`;
  return new Date(isoString);
};

const COLLECTION_NAME = "orders";

export const ORDER_STATUS_FLOW = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'completed',
  'cancelled',
];

export const normalizeOrderStatus = (order) => {
  const raw = (order?.status || order?.orderStatus || 'pending').toString().toLowerCase().trim();
  if (raw === 'out for delivery') return 'out_for_delivery';
  if (raw === 'delivered') return 'completed';
  return raw;
};

export const formatOrderStatusLabel = (status) => {
  if (!status) return 'Pending';
  return status
    .replaceAll('_', ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

/**
 * Subscribe to all orders in real-time
 */
export const subscribeToOrders = (callback, limitCount = 100) => {
  const ordersRef = collection(db, COLLECTION_NAME);
  // Order by newest first
  const q = query(ordersRef, orderBy("createdAt", "desc"), limit(limitCount));

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
    const { auth } = await import('./firebase');
    const changedBy = auth?.currentUser?.email || 'admin';
    const orderRef = doc(db, COLLECTION_NAME, orderId);
    
    const updateData = {
      status: newStatus,
      orderStatus: newStatus,
      statusHistory: arrayUnion({
        status: newStatus,
        timestamp: new Date().toISOString(),
        changedBy: changedBy
      }),
      updatedAt: serverTimestamp()
    };

    if (newStatus === 'cancelled') {
      updateData.cancellationTimestamp = serverTimestamp();
      updateData.cancelledBy = changedBy;
    }

    await updateDoc(orderRef, updateData);
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
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create order');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const fetchOrdersByDateRange = async (startDate, endDate) => {
  const ordersRef = collection(db, COLLECTION_NAME);
  const q = query(
    ordersRef,
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate),
    orderBy('createdAt', 'desc'),
    limit(500),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
};

export const countOrdersByStatusAndDate = async (status, startDate, endDate) => {
  const ordersRef = collection(db, COLLECTION_NAME);
  const q = query(
    ordersRef,
    where('status', '==', status),
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate),
  );
  const countSnap = await getCountFromServer(q);
  return countSnap.data().count;
};
