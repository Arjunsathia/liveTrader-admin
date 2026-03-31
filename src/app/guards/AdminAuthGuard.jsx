import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminSession } from '../providers/AdminSessionProvider';

export function AdminAuthGuard({ children }) {
  const { isAuthenticated } = useAdminSession();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
