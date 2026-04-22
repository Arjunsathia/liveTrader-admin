import React, { createContext, useContext, useMemo } from 'react';
import { ROLE_PRESETS } from '@config/permissions/permissions';

const AdminSessionContext = createContext(null);

const defaultSession = {
  user: {
    id: 'adm-01',
    name: 'Ariana Reed',
    initials: 'AR',
    role: 'super-admin',
  },
};

export function AdminSessionProvider({ children }) {
  const value = useMemo(() => {
    const permissions = ROLE_PRESETS[defaultSession.user.role] ?? [];

    return {
      ...defaultSession,
      permissions,
      isAuthenticated: true,
    };
  }, []);

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);

  if (!context) {
    throw new Error('useAdminSession must be used within AdminSessionProvider');
  }

  return context;
}
