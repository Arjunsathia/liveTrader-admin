import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Shield, Key } from 'lucide-react';
import AdminUsersPage from './AdminUsersPage';
import RolesPage from './RolesPage';
import PermissionsPage from './PermissionsPage';

const NAV_ITEMS = [
  { id: 'users', label: 'Admin Users', Icon: Users, path: '/admin-mgmt/users' },
  { id: 'roles', label: 'Roles', Icon: Shield, path: '/admin-mgmt/roles' },
  { id: 'permissions', label: 'Permissions', Icon: Key, path: '/admin-mgmt/permissions' },
];


export function RolesPermissionsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = NAV_ITEMS.find(item => item.path === location.pathname) || NAV_ITEMS[0];
  const page = activeItem.id;

  const renderPage = () => {
    switch (page) {
      case 'users': return <AdminUsersPage />;
      case 'roles': return <RolesPage />;
      case 'permissions': return <PermissionsPage />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sticky header + sub-nav */}
      <div className="sticky top-0 z-[50] -mx-4 md:-mx-8 mb-6 border-b border-white/[0.06] bg-bg/80 backdrop-blur-md px-4 md:px-8 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[26px] font-bold tracking-[-0.04em] text-text">Admin Management</h1>
            <p className="mt-1 text-[13px] font-medium text-text-muted/50">Manage system administrators, roles, and security policies.</p>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const active = item.id === page;
            const Icon = item.Icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`group relative flex h-11 items-center gap-2.5 border-b-2 px-4 transition-all duration-200 cursor-pointer whitespace-nowrap
                  ${active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted/40 hover:text-text-muted hover:border-white/10'
                  }`}
              >
                <Icon size={14} className={active ? 'text-primary' : 'text-text-muted/30 group-hover:text-text-muted/50'} />
                <span className="text-[12px] font-bold uppercase tracking-wider font-heading">{item.label}</span>
                {item.badge && (
                  <span className={`flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1 text-[9px] font-black
                    ${active ? 'bg-primary text-black' : 'bg-white/5 text-text-muted/40'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderPage()}
      </div>
    </div>
  );
}