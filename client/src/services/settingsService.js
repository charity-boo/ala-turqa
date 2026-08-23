import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const SETTINGS_COLLECTION = 'settings';

export const getSettingDoc = async (key) => {
  const ref = doc(db, SETTINGS_COLLECTION, key);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const saveSettingDoc = async (key, data) => {
  const ref = doc(db, SETTINGS_COLLECTION, key);
  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};
