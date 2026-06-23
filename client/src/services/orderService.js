import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const ordersCollection = collection(db, "orders");

export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      timestamp: new Date().toISOString(),
      status: "pending"
    });
    return { ...orderData, id: docRef.id };
  } catch (error) {
    console.error("Error creating order: ", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const data = await getDocs(ordersCollection);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error getting orders: ", error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id };
    } else {
      throw new Error("No such order!");
    }
  } catch (error) {
    console.error(`Error getting order with ID ${id}: `, error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const docRef = doc(db, "orders", id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error(`Error updating order status with ID ${id}: `, error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const docRef = doc(db, "orders", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting order with ID ${id}: `, error);
    throw error;
  }
};
