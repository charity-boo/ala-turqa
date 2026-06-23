import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { uploadImage, deleteImage } from './storageService';

const COLLECTION_NAME = 'gallery';

export const getGalleryImages = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    throw error;
  }
};

export const addGalleryImage = async (data, file) => {
  try {
    let imageUrl = data.image;
    if (file) {
      imageUrl = await uploadImage(file, 'gallery');
    }
    const newImage = {
      ...data,
      image: imageUrl,
      uploadedAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newImage);
    return { id: docRef.id, ...newImage };
  } catch (error) {
    console.error("Error adding gallery image:", error);
    throw error;
  }
};

export const updateGalleryImage = async (id, data, file = null) => {
  try {
    let imageUrl = data.image;
    if (file) {
      imageUrl = await uploadImage(file, 'gallery');
    }
    const updatedData = { ...data, image: imageUrl };
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    console.error("Error updating gallery image:", error);
    throw error;
  }
};

export const deleteGalleryImageEntry = async (id, imageUrl) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    if (imageUrl) {
      await deleteImage(imageUrl);
    }
    return id;
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw error;
  }
};
