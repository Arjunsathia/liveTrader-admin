import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import AdminUsersPage from './AdminUsersPage';
import RolesPage from './RolesPage';
import PermissionsPage from './PermissionsPage';

export function RolesPermissionsPage() {
  const location = useLocation();

  const renderPage = () => {
    switch (location.pathname) {
      case '/admin-mgmt/users': return <AdminUsersPage />;
      case '/admin-mgmt/roles': return <RolesPage />;
      case '/admin-mgmt/permissions': return <PermissionsPage />;
      default: return null;
    }
  };

  return (
    <PageShell>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {renderPage()}
      </div>
    </PageShell>
  );
}

export default RolesPermissionsPage;