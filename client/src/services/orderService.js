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
  arrayUnion,
  startAfter
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

const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['out_for_delivery', 'completed', 'cancelled'],
  out_for_delivery: ['completed', 'cancelled'],
  completed: [],
  cancelled: []
};

/**
 * Update order status with validation and atomic transaction handling
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const { auth } = await import('./firebase');
    const { runTransaction } = await import('firebase/firestore');
    const changedBy = auth?.currentUser?.email || auth?.currentUser?.displayName || 'admin';
    const orderRef = doc(db, COLLECTION_NAME, orderId);

    await runTransaction(db, async (transaction) => {
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const currentData = orderDoc.data();
      const currentStatus = normalizeOrderStatus(currentData);

      // Terminal state check
      if (['completed', 'cancelled'].includes(currentStatus)) {
        throw new Error(`Order is already ${currentStatus} and cannot be modified.`);
      }

      // Transition validity check
      const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
      if (!allowed.includes(newStatus)) {
        throw new Error(`Invalid status transition from '${formatOrderStatusLabel(currentStatus)}' to '${formatOrderStatusLabel(newStatus)}'.`);
      }

      const historyEntry = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        changedBy: changedBy
      };

      const existingHistory = Array.isArray(currentData.statusHistory) ? currentData.statusHistory : [];

      const updateData = {
        status: newStatus,
        orderStatus: newStatus,
        statusHistory: [...existingHistory, historyEntry],
        updatedAt: serverTimestamp()
      };

      if (newStatus === 'cancelled') {
        updateData.cancellationTimestamp = serverTimestamp();
        updateData.cancelledBy = changedBy;
      }

      transaction.update(orderRef, updateData);
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

/**
 * Helper to compute precise start and end Date objects for Kenya Timezone (Africa/Nairobi UTC+3)
 */
export const getKenyaDateBounds = (dateRange = 'today', customDateStr = null) => {
  const now = new Date();
  const kenyaFormatter = new Intl.DateTimeFormat('en-US', { 
    timeZone: 'Africa/Nairobi', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
  
  const [month, day, year] = kenyaFormatter.format(now).split('/');
  const todayStartISO = `${year}-${month}-${day}T00:00:00+03:00`;
  const todayStart = new Date(todayStartISO);

  if (dateRange === 'today') {
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    return { startDate: todayStart, endDate: todayEnd };
  }

  if (dateRange === 'yesterday') {
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayEnd = new Date(todayStart.getTime() - 1);
    return { startDate: yesterdayStart, endDate: yesterdayEnd };
  }

  if (dateRange === '7days') {
    const start = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);
    const end = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    return { startDate: start, endDate: end };
  }

  if (dateRange === '30days') {
    const start = new Date(todayStart.getTime() - 29 * 24 * 60 * 60 * 1000);
    const end = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    return { startDate: start, endDate: end };
  }

  if (dateRange === 'custom' && customDateStr) {
    const [cYear, cMonth, cDay] = customDateStr.split('-');
    const customStart = new Date(`${cYear}-${cMonth}-${cDay}T00:00:00+03:00`);
    const customEnd = new Date(customStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    return { startDate: customStart, endDate: customEnd };
  }

  // Default 'all' or fallback
  return { startDate: null, endDate: null };
};

/**
 * Subscribe to paginated orders with cursor-based pagination and real-time updates
 */
export const subscribeToPaginatedOrders = ({
  pageSize = 10,
  startAfterDoc = null,
  dateRange = 'today',
  customDateStr = null,
  status = 'all',
  paymentStatus = 'all',
  deliveryProvider = 'all',
  onData,
  onError
}) => {
  const ordersRef = collection(db, COLLECTION_NAME);
  const constraints = [];

  const { startDate, endDate } = getKenyaDateBounds(dateRange, customDateStr);

  if (startDate) {
    constraints.push(where('createdAt', '>=', startDate));
  }
  if (endDate) {
    constraints.push(where('createdAt', '<=', endDate));
  }

  if (status && status !== 'all') {
    constraints.push(where('status', '==', status));
  }
  if (paymentStatus && paymentStatus !== 'all') {
    constraints.push(where('paymentStatus', '==', paymentStatus));
  }
  if (deliveryProvider && deliveryProvider !== 'all') {
    if (deliveryProvider === 'pickup') {
      constraints.push(where('deliveryMethod', '==', 'Pickup'));
    } else {
      constraints.push(where('deliveryProvider', '==', deliveryProvider));
    }
  }

  constraints.push(orderBy('createdAt', 'desc'));

  if (startAfterDoc) {
    constraints.push(startAfter(startAfterDoc));
  }

  constraints.push(limit(pageSize));

  const q = query(ordersRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs;
    const orders = docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
      _doc: docSnap
    }));

    const lastVisible = docs.length > 0 ? docs[docs.length - 1] : null;
    const firstVisible = docs.length > 0 ? docs[0] : null;

    onData({
      orders,
      firstVisible,
      lastVisible,
      hasMore: docs.length === pageSize
    });
  }, (err) => {
    console.error("Error subscribing to paginated orders:", err);
    if (onError) onError(err);
  });
};

/**
 * Get total order count for a specific date range and filter context using Firestore Aggregation
 */
export const getFilteredOrdersCount = async ({
  dateRange = 'today',
  customDateStr = null,
  status = 'all',
  paymentStatus = 'all',
  deliveryProvider = 'all'
}) => {
  try {
    const ordersRef = collection(db, COLLECTION_NAME);
    const constraints = [];
    const { startDate, endDate } = getKenyaDateBounds(dateRange, customDateStr);

    if (startDate) constraints.push(where('createdAt', '>=', startDate));
    if (endDate) constraints.push(where('createdAt', '<=', endDate));
    if (status && status !== 'all') constraints.push(where('status', '==', status));
    if (paymentStatus && paymentStatus !== 'all') constraints.push(where('paymentStatus', '==', paymentStatus));
    if (deliveryProvider && deliveryProvider !== 'all') {
      if (deliveryProvider === 'pickup') {
        constraints.push(where('deliveryMethod', '==', 'Pickup'));
      } else {
        constraints.push(where('deliveryProvider', '==', deliveryProvider));
      }
    }

    const q = query(ordersRef, ...constraints);
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.warn("Could not get count from server:", error.message);
    return null;
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
