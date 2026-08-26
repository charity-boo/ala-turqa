import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from './firebase';

const persistenceReady = setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to configure Firebase auth persistence:', error);
  throw error;
});

const ensurePersistence = async () => {
  await persistenceReady;
};

const getAuthErrorMessage = (error) => {
  const code = error?.code || 'auth/unknown';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/user-not-found':
      return 'No account found for this email.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was closed before completion.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by the browser.';
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.';
    default:
      return error?.message || 'Authentication failed.';
  }
};

export const subscribeToAuthState = (callback) => onAuthStateChanged(auth, callback);

export const registerWithEmailAndPassword = async (email, password) => {
  await ensurePersistence();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error during registration:', error);
    throw new Error(getAuthErrorMessage(error), { cause: error });
  }
};

export const loginWithEmailAndPassword = async (email, password) => {
  await ensurePersistence();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error(getAuthErrorMessage(error), { cause: error });
  }
};

export const loginWithGoogle = async () => {
  await ensurePersistence();

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error during Google login:', error);
    throw new Error(getAuthErrorMessage(error), { cause: error });
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error(getAuthErrorMessage(error), { cause: error });
  }
};

export const updateUserProfile = async (displayName, photoURL) => {
  if (!auth.currentUser) throw new Error('No authenticated user');
  try {
    await updateProfile(auth.currentUser, { displayName, photoURL });
    return auth.currentUser;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error(getAuthErrorMessage(error), { cause: error });
  }
};

export const changeUserPassword = async (currentPassword, newPassword) => {
  if (!auth.currentUser) throw new Error('No authenticated user');
  try {
    // Re-authenticate first
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    
    // Update password
    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    console.error('Error changing password:', error);
    throw new Error(getAuthErrorMessage(error), { cause: error });
  }
};
