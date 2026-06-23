import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const reservationsCollection = collection(db, "reservations");

export const createReservation = async (data) => {
  try {
    const docRef = await addDoc(reservationsCollection, {
      ...data,
      status: "pending",
      timestamp: new Date().toISOString()
    });
    return { ...data, id: docRef.id };
  } catch (error) {
    console.error("Error creating reservation: ", error);
    throw error;
  }
};

export const getAllReservations = async () => {
  try {
    const data = await getDocs(reservationsCollection);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error getting reservations: ", error);
    throw error;
  }
};

export const updateReservationStatus = async (id, status) => {
  try {
    const docRef = doc(db, "reservations", id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error(`Error updating reservation status with ID ${id}: `, error);
    throw error;
  }
};

export const deleteReservation = async (id) => {
  try {
    const docRef = doc(db, "reservations", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting reservation with ID ${id}: `, error);
    throw error;
  }
};
