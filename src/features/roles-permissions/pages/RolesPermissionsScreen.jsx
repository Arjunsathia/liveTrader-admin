import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Shield, Key, LogIn, Activity } from 'lucide-react';
import { AdminUsersScreen } from './AdminUsersScreen';
import { RolesScreen } from './RolesScreen';
import { PermissionsScreen } from './PermissionsScreen';
import { AccessLogsScreen } from './AccessLogsScreen';
import { ActivityLogsScreen } from './ActivityLogsScreen';

const NAV_ITEMS = [
  { id: 'users', label: 'Admin Users', Icon: Users, path: '/admin-mgmt/users' },
  { id: 'roles', label: 'Roles', Icon: Shield, path: '/admin-mgmt/roles' },
  { id: 'permissions', label: 'Permissions', Icon: Key, path: '/admin-mgmt/permissions' },
  { id: 'access', label: 'Access Logs', Icon: LogIn, badge: 2, path: '/admin-mgmt/access-logs' },
  { id: 'activity', label: 'Activity Logs', Icon: Activity, path: '/admin-mgmt/activity-logs' },
];


export function RolesPermissionsScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = NAV_ITEMS.find(item => item.path === location.pathname) || NAV_ITEMS[0];
  const page = activeItem.id;

  const renderPage = () => {
    switch (page) {
      case 'users': return <AdminUsersScreen />;
      case 'roles': return <RolesScreen />;
      case 'permissions': return <PermissionsScreen />;
      case 'access': return <AccessLogsScreen />;
      case 'activity': return <ActivityLogsScreen />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sticky header + sub-nav */}
      {/* Content */}
      <div className="">
        {renderPage()}
      </div>
    </div>
  );
}

export default RolesPermissionsScreen;