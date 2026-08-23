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
    const orderRef = doc(db, COLLECTION_NAME, orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      orderStatus: newStatus,
      statusHistory: arrayUnion({
        status: newStatus,
        timestamp: new Date().toISOString(),
      }),
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
      const firstItem = orderData.items.find(item => item && (item.name || item.itemName));
      const firstItemName = String(firstItem?.name || firstItem?.itemName || 'order')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      // Keep it somewhat short, e.g., max 20 chars of the name
      const shortName = firstItemName.substring(0, 20);
      customId = `${shortName}-${Date.now()}`;
    }

    const docRef = doc(db, COLLECTION_NAME, customId);
    
    const newOrderData = {
      ...orderData,
      status: 'pending',
      orderStatus: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
        },
      ],
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
