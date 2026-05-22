import React, { createElement } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';
import { MainLayout } from '@app/layout/MainLayout';
import { AdminAuthGuard } from '@app/guards/AdminAuthGuard';
import { PermissionGuard } from '@app/guards/PermissionGuard';
import { adminRedirectRoutes, adminRouteModules } from '@config/routes/admin-routes.config';

// ── Feature pages — imported directly (no src/pages wrapper needed) ──
import { DashboardPage } from '@features/dashboard/pages/DashboardPage';
import { UsersPage } from '@features/users/pages/UsersPage';
import { KYCQueuePage } from '@features/kyc/pages/KYCQueuePage';
import { MT5QueuePage } from '@features/users/pages/MT5QueuePage';
import { UserDetailPage } from '@features/users/pages/UserDetailPage';
import { FinancePage } from '@features/finance/pages/FinancePage';
import { TradingAccountsPage } from '@features/trading/pages/TradingAccountsPage';
import { OrdersPage } from '@features/trading/pages/OrdersPage';
import { PositionsPage } from '@features/trading/pages/PositionsPage';
import { TradeHistoryPage } from '@features/trading/pages/TradeHistoryPage';
import { ExecutionLogsPage } from '@features/trading/pages/ExecutionLogsPage';
import { CopyTradingPage } from '@features/copy-trading/pages/CopyTradingPage';
import { CopyTradingDetailPage } from '@features/copy-trading/pages/CopyTradingDetailPage';
import { IBSystemPage } from '@features/ib-system/pages/IBSystemPage';
import { PropTradingPage } from '@features/prop-trading/pages/PropTradingPage';
import { ReportsPage } from '@features/reports/pages/ReportsPage';
import { SupportPage } from '@features/support/pages/SupportPage';
import { TicketDetailPage } from '@features/support/pages/TicketDetailPage';
import { SettingsPage } from '@features/settings/pages/SettingsPage';
import { RolesPermissionsPage } from '@features/roles-permissions/pages/RolesPermissionsPage';

import { NotFoundPage } from '@app/pages/NotFoundPage';

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
