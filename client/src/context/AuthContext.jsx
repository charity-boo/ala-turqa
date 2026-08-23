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
  const [claims, setClaims] = useState(null);
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

  const readClaims = async (user, forceRefresh = false) => {
    if (!user) {
      setClaims(null);
      return null;
    }

    try {
      const tokenResult = await user.getIdTokenResult(forceRefresh);
      setClaims(tokenResult?.claims || null);
      return tokenResult?.claims || null;
    } catch (error) {
      console.error('Failed to read auth claims:', error);
      setClaims(null);
      return null;
    }
  };

  const refreshClaims = async () => {
    if (!currentUser) return null;
    return await readClaims(currentUser, true);
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      setCurrentUser(user);
      await readClaims(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const role = claims?.role || null;
  const isAdmin = claims?.admin === true;

  const value = useMemo(
    () => ({
      currentUser,
      claims,
      role,
      isAdmin,
      loading,
      register,
      login,
      logout,
      googleLogin,
      refreshClaims,
    }),
    [currentUser, claims, role, isAdmin, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
