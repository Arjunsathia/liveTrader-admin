import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AuthContext } from './AuthContext';
import { authenticateUser } from './authService';
import { setSession, clearSession } from '@/app/store/slices/authSlice';

/**
 * AuthProvider
 *
 * Wraps application auth state using Redux Toolkit store.
 * Maintains context compatibility so components using useAuth function correctly.
 */
export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  
  // Read from Redux Store
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const permissions = useSelector((state) => state.auth.permissions);

  const login = useCallback(async (email, password) => {
    // authenticateUser throws on bad credentials
    const authenticatedUser = authenticateUser(email, password);
    dispatch(setSession(authenticatedUser));
    return authenticatedUser;
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(clearSession());
  }, [dispatch]);

  const value = useMemo(() => ({
    user,
    permissions,
    isAuthenticated,
    login,
    logout,
  }), [user, permissions, isAuthenticated, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
