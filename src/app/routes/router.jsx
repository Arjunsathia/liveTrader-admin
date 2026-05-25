import React, { createElement } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { MainLayout } from '@/app/layout/MainLayout';
import { AdminAuthGuard } from '@/app/guards/AdminAuthGuard';
import { PermissionGuard } from '@/app/guards/PermissionGuard';
import { adminRedirectRoutes, adminRouteModules } from '@/config/routes/admin-routes.config';

// ── Feature pages — imported directly (no src/pages wrapper needed) ──
import { DashboardPage } from '@/features/dashboard';
import { UsersPage, MT5QueuePage, UserDetailPage, KYCQueuePage } from '@/features/users';
import { FinancePage } from '@/features/finance';
import { TradingAccountsPage, OrdersPage, PositionsPage, TradeHistoryPage, ExecutionLogsPage } from '@/features/trading';
import { CopyTradingPage, CopyTradingDetailPage } from '@/features/copy-trading';
import { IBSystemPage } from '@/features/ib-system';
import { PropTradingPage } from '@/features/prop-trading';
import { ReportsPage } from '@/features/reports';
import { SupportPage, TicketDetailPage } from '@/features/support';
import { SettingsPage } from '@/features/settings';
import { RolesPermissionsPage } from '@/features/roles-permissions';

import { NotFoundPage } from '@/app/pages/NotFoundPage';

const pageRegistry = {
  'dashboard/dashboard': DashboardPage,
  'users/users-list': UsersPage,
  'users/kyc-queue': KYCQueuePage,
  'users/mt5-queue': MT5QueuePage,
  'users/user-detail': UserDetailPage,
  'finance/finance-workspace': FinancePage,
  'trading/trading-accounts': TradingAccountsPage,
  'trading/orders': OrdersPage,
  'trading/positions': PositionsPage,
  'trading/trade-history': TradeHistoryPage,
  'trading/execution-logs': ExecutionLogsPage,
  'copy-trading/strategies':    CopyTradingPage,
  'copy-trading/providers':     CopyTradingPage,
  'copy-trading/followers':     CopyTradingPage,
  'copy-trading/subscriptions': CopyTradingPage,
  'copy-trading/performance':   CopyTradingPage,
  'copy-trading/logs':          CopyTradingPage,
  'copy-trading/copy-trading-detail': CopyTradingDetailPage,
  'ib-system/ib-system-workspace': IBSystemPage,
  'prop-trading/prop-trading-workspace': PropTradingPage,
  'reports/reports-workspace': ReportsPage,
  'support/support-workspace': SupportPage,
  'support/ticket-detail': TicketDetailPage,
  'settings/settings-workspace': SettingsPage,
  'admin-mgmt/roles-permissions-workspace': RolesPermissionsPage,

};

function withPermission(permission, PageComponent) {
  return (
    <PermissionGuard permission={permission}>
      {createElement(PageComponent)}
    </PermissionGuard>
  );
}

function toChildRoutePath(path) {
  return path.replace(/^\//, '');
}

function buildModuleRoutes() {
  return adminRouteModules.flatMap((module) =>
    module.routes.map((route) => {
      const PageComponent = pageRegistry[route.pageKey];

      if (!PageComponent) {
        throw new Error(`Missing page wrapper for route key: ${route.pageKey}`);
      }

      if (route.path === '/') {
        return {
          index: true,
          element: withPermission(route.permission, PageComponent),
        };
      }

      return {
        path: toChildRoutePath(route.path),
        element: withPermission(route.permission, PageComponent),
      };
    }),
  );
}

export const adminRouter = createHashRouter([
  {
    path: '/',
    element: (
      <AdminAuthGuard>
        <MainLayout />
      </AdminAuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      ...adminRedirectRoutes.map((route) => ({
        path: toChildRoutePath(route.path),
        element: <Navigate to={route.to} replace />,
      })),
      ...buildModuleRoutes(),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
