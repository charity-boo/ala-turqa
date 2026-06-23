import { useEffect, useMemo, useState } from 'react';
import {
  loginWithEmailAndPassword,
  loginWithGoogle,
  logoutUser,
  registerWithEmailAndPassword,
  subscribeToAuthState,
} from '../services/authService';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password) => {
    try {
      return await registerWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      return await loginWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      return await loginWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      register,
      login,
      logout,
      googleLogin,
    }),
    [currentUser, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
