import React, { createElement } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';
import { MainLayout } from '@app/layout/MainLayout';
import { AdminAuthGuard } from '@app/guards/AdminAuthGuard';
import { PermissionGuard } from '@app/guards/PermissionGuard';
import { adminRedirectRoutes, adminRouteModules } from '@config/routes/admin-routes.config';

// ── Feature pages — imported directly (no src/pages wrapper needed) ──
import { DashboardScreen } from '@features/dashboard/pages/DashboardScreen';
import { UsersListScreen } from '@features/users/pages/UsersListScreen';
import { KycQueueScreen } from '@features/kyc/pages/KycQueueScreen';
import { Mt5QueueScreen } from '@features/users/pages/Mt5QueueScreen';
import { UserDetailScreen } from '@features/users/pages/UserDetailScreen';
import { FinanceScreen } from '@features/finance/pages/FinanceScreen';
import { FinanceDetailScreen } from '@features/finance/pages/FinanceDetailScreen';
import { TradingAccountsScreen } from '@features/trading/pages/TradingAccountsScreen';
import { OrdersScreen } from '@features/trading/pages/OrdersScreen';
import { PositionsScreen } from '@features/trading/pages/PositionsScreen';
import { TradeHistoryScreen } from '@features/trading/pages/TradeHistoryScreen';
import { ExecutionLogsScreen } from '@features/trading/pages/ExecutionLogsScreen';
import { StrategiesScreen } from '@features/copy-trading/pages/StrategiesScreen';
import { ProvidersScreen } from '@features/copy-trading/pages/ProvidersScreen';
import { FollowersScreen } from '@features/copy-trading/pages/FollowersScreen';
import { SubscriptionsScreen } from '@features/copy-trading/pages/SubscriptionsScreen';
import { PerformanceScreen } from '@features/copy-trading/pages/PerformanceScreen';
import { LogsScreen } from '@features/copy-trading/pages/LogsScreen';
import { CopyTradingDetailScreen } from '@features/copy-trading/pages/CopyTradingDetailScreen';
import { IBSystemScreen } from '@features/ib-system/pages/IBSystemScreen';
import { PropTradingScreen } from '@features/prop-trading/pages/PropTradingScreen';
import { ReportsScreen } from '@features/reports/pages/ReportsScreen';
import { SupportScreen } from '@features/support/pages/SupportScreen';
import { TicketDetailScreen } from '@features/support/pages/TicketDetailScreen';
import { SettingsScreen } from '@features/settings/pages/SettingsScreen';
import { RolesPermissionsScreen } from '@features/roles-permissions/pages/RolesPermissionsScreen';
import { AuditLogsScreen } from '@features/audit-logs/pages/AuditLogsScreen';
import { NotFoundScreen } from '@features/not-found/NotFoundScreen';

const pageRegistry = {
  'dashboard/dashboard': DashboardScreen,
  'users/users-list': UsersListScreen,
  'users/kyc-queue': KycQueueScreen,
  'users/mt5-queue': Mt5QueueScreen,
  'users/user-detail': UserDetailScreen,
  'finance/finance-workspace': FinanceScreen,
  'finance/finance-detail': FinanceDetailScreen,
  'trading/trading-accounts': TradingAccountsScreen,
  'trading/orders': OrdersScreen,
  'trading/positions': PositionsScreen,
  'trading/trade-history': TradeHistoryScreen,
  'trading/execution-logs': ExecutionLogsScreen,
  'copy-trading/strategies': StrategiesScreen,
  'copy-trading/providers': ProvidersScreen,
  'copy-trading/followers': FollowersScreen,
  'copy-trading/subscriptions': SubscriptionsScreen,
  'copy-trading/performance': PerformanceScreen,
  'copy-trading/logs': LogsScreen,
  'copy-trading/copy-trading-detail': CopyTradingDetailScreen,
  'ib-system/ib-system-workspace': IBSystemScreen,
  'prop-trading/prop-trading-workspace': PropTradingScreen,
  'reports/reports-workspace': ReportsScreen,
  'support/support-workspace': SupportScreen,
  'support/ticket-detail': TicketDetailScreen,
  'settings/settings-workspace': SettingsScreen,
  'admin-mgmt/roles-permissions-workspace': RolesPermissionsScreen,
  'admin-mgmt/audit-logs-workspace': RolesPermissionsScreen,
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
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
]);
