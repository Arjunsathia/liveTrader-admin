import React from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';
import { MainLayout } from '../../layout/MainLayout';
import { AdminAuthGuard } from '../guards/AdminAuthGuard';
import { PermissionGuard } from '../guards/PermissionGuard';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { UsersListPage } from '../../features/users/pages/UsersListPage';
import { KycQueuePage } from '../../features/users/pages/KycQueuePage';
import { Mt5QueuePage } from '../../features/users/pages/Mt5QueuePage';
import { UserDetailPage } from '../../features/users/pages/UserDetailPage';
import { FinancePage } from '../../features/finance/pages/FinancePage';
import { FinanceDetailPage } from '../../features/finance/pages/FinanceDetailPage';
import { IBSystemPage } from '../../features/ib-system/pages/IBSystemPage';
import { TradingAccountsPage } from '../../features/trading/pages/TradingAccountsPage';
import { OrdersPage } from '../../features/trading/pages/OrdersPage';
import { PositionsPage } from '../../features/trading/pages/PositionsPage';
import { TradeHistoryPage } from '../../features/trading/pages/TradeHistoryPage';
import { ExecutionLogsPage } from '../../features/trading/pages/ExecutionLogsPage';
import { StrategiesPage }    from '../../features/copy-trading/pages/StrategiesPage';
import { ProvidersPage }     from '../../features/copy-trading/pages/ProvidersPage';
import { FollowersPage }     from '../../features/copy-trading/pages/FollowersPage';
import { SubscriptionsPage } from '../../features/copy-trading/pages/SubscriptionsPage';
import { PerformancePage }   from '../../features/copy-trading/pages/PerformancePage';
import { LogsPage }          from '../../features/copy-trading/pages/LogsPage';
import { CopyTradingDetailPage } from '../../features/copy-trading/pages/CopyTradingDetailPage';
import { PropTradingPage } from '../../features/prop-trading/pages/PropTradingPage';
import { ReportsPage } from '../../features/reports/pages/ReportsPage';
import { SupportPage } from '../../features/support/pages/SupportPage';
import { TicketDetailPage } from '../../features/support/pages/TicketDetailPage';
import { SettingsPage } from '../../features/settings/pages/SettingsPage';
import { AdminMgmtPage } from '../../features/admin-mgmt/pages/AdminMgmtPage';
import { PERMISSIONS } from '../config/permissions';

function withPermission(permission, element) {
  return <PermissionGuard permission={permission}>{element}</PermissionGuard>;
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
      { index: true, element: withPermission(PERMISSIONS.dashboard.view, <DashboardPage />) },

      { path: 'users', element: withPermission(PERMISSIONS.users.view, <UsersListPage />) },
      { path: 'users/kyc', element: withPermission(PERMISSIONS.users.kyc, <KycQueuePage />) },
      { path: 'users/mt5', element: withPermission(PERMISSIONS.users.mt5, <Mt5QueuePage />) },
      { path: 'users/:userId', element: withPermission(PERMISSIONS.users.view, <UserDetailPage />) },
      { path: 'users/:userId/:tab', element: withPermission(PERMISSIONS.users.view, <UserDetailPage />) },

      { path: 'finance', element: <Navigate to="/finance/deposits" replace /> },
      { path: 'finance/deposits', element: withPermission(PERMISSIONS.finance.view, <FinancePage />) },
      { path: 'finance/withdrawals', element: withPermission(PERMISSIONS.finance.view, <FinancePage />) },
      { path: 'finance/transactions', element: withPermission(PERMISSIONS.finance.view, <FinancePage />) },
      { path: 'finance/failed-payments', element: withPermission(PERMISSIONS.finance.view, <FinancePage />) },
      { path: 'finance/approvals', element: withPermission(PERMISSIONS.finance.approve, <FinancePage />) },
      { path: 'finance/:slug/:id', element: withPermission(PERMISSIONS.finance.view, <FinanceDetailPage />) },

      { path: 'trading', element: <Navigate to="/trading/accounts" replace /> },
      { path: 'trading/accounts', element: withPermission(PERMISSIONS.trading.view, <TradingAccountsPage />) },
      { path: 'trading/orders', element: withPermission(PERMISSIONS.trading.view, <OrdersPage />) },
      { path: 'trading/positions', element: withPermission(PERMISSIONS.trading.view, <PositionsPage />) },
      { path: 'trading/history', element: withPermission(PERMISSIONS.trading.view, <TradeHistoryPage />) },
      { path: 'trading/execution-logs', element: withPermission(PERMISSIONS.trading.view, <ExecutionLogsPage />) },

      { path: 'copy-trading', element: <Navigate to="/copy-trading/strategies" replace /> },
      { path: 'copy-trading/strategies',    element: withPermission(PERMISSIONS.copyTrading.view, <StrategiesPage />)    },
      { path: 'copy-trading/providers',     element: withPermission(PERMISSIONS.copyTrading.view, <ProvidersPage />)     },
      { path: 'copy-trading/followers',     element: withPermission(PERMISSIONS.copyTrading.view, <FollowersPage />)     },
      { path: 'copy-trading/subscriptions', element: withPermission(PERMISSIONS.copyTrading.view, <SubscriptionsPage />) },
      { path: 'copy-trading/performance',   element: withPermission(PERMISSIONS.copyTrading.view, <PerformancePage />)   },
      { path: 'copy-trading/logs',          element: withPermission(PERMISSIONS.copyTrading.view, <LogsPage />)          },
      { path: 'copy-trading/:slug/:id',     element: withPermission(PERMISSIONS.copyTrading.view, <CopyTradingDetailPage />) },

      { path: 'prop-trading', element: withPermission(PERMISSIONS.propTrading.view, <PropTradingPage />) },
      { path: 'prop-trading/challenge-configurations', element: withPermission(PERMISSIONS.propTrading.manage, <PropTradingPage />) },
      { path: 'prop-trading/evaluation-requests', element: withPermission(PERMISSIONS.propTrading.approve, <PropTradingPage />) },
      { path: 'prop-trading/funded-accounts', element: withPermission(PERMISSIONS.propTrading.view, <PropTradingPage />) },
      { path: 'prop-trading/statistics', element: withPermission(PERMISSIONS.propTrading.view, <PropTradingPage />) },
      { path: 'prop-trading/fees-coupons', element: withPermission(PERMISSIONS.propTrading.manage, <PropTradingPage />) },
      { path: 'prop-trading/rules-risk', element: withPermission(PERMISSIONS.propTrading.manage, <PropTradingPage />) },

      { path: 'ib-system', element: <Navigate to="/ib-system/referrals" replace /> },
      { path: 'ib-system/referrals', element: withPermission(PERMISSIONS.ibSystem.view, <IBSystemPage />) },
      { path: 'ib-system/commissions', element: withPermission(PERMISSIONS.ibSystem.view, <IBSystemPage />) },
      { path: 'ib-system/payouts', element: withPermission(PERMISSIONS.ibSystem.payouts, <IBSystemPage />) },
      { path: 'ib-system/performance', element: withPermission(PERMISSIONS.ibSystem.view, <IBSystemPage />) },

      { path: 'reports', element: <Navigate to="/reports/finance" replace /> },
      { path: 'reports/finance', element: withPermission(PERMISSIONS.reports.view, <ReportsPage />) },
      { path: 'reports/trading', element: withPermission(PERMISSIONS.reports.view, <ReportsPage />) },
      { path: 'reports/users', element: withPermission(PERMISSIONS.reports.view, <ReportsPage />) },
      { path: 'reports/system', element: withPermission(PERMISSIONS.reports.view, <ReportsPage />) },
      { path: 'reports/exports', element: withPermission(PERMISSIONS.reports.export, <ReportsPage />) },

      { path: 'support', element: <Navigate to="/support/tickets" replace /> },
      { path: 'support/tickets', element: withPermission(PERMISSIONS.support.view, <SupportPage />) },
      { path: 'support/tickets/:ticketId', element: withPermission(PERMISSIONS.support.view, <TicketDetailPage />) },
      { path: 'support/escalated', element: withPermission(PERMISSIONS.support.escalate, <SupportPage />) },

      { path: 'settings', element: <Navigate to="/settings/api" replace /> },
      { path: 'settings/api', element: withPermission(PERMISSIONS.settings.view, <SettingsPage />) },
      { path: 'settings/payment-gateway', element: withPermission(PERMISSIONS.settings.view, <SettingsPage />) },
      { path: 'settings/kyc', element: withPermission(PERMISSIONS.settings.view, <SettingsPage />) },
      { path: 'settings/trading', element: withPermission(PERMISSIONS.settings.view, <SettingsPage />) },
      { path: 'settings/notifications', element: withPermission(PERMISSIONS.settings.view, <SettingsPage />) },
      { path: 'settings/system', element: withPermission(PERMISSIONS.settings.view, <SettingsPage />) },

      { path: 'admin-mgmt', element: <Navigate to="/admin-mgmt/users" replace /> },
      { path: 'admin-mgmt/users', element: withPermission(PERMISSIONS.adminMgmt.view, <AdminMgmtPage />) },
      { path: 'admin-mgmt/roles', element: withPermission(PERMISSIONS.adminMgmt.view, <AdminMgmtPage />) },
      { path: 'admin-mgmt/permissions', element: withPermission(PERMISSIONS.adminMgmt.view, <AdminMgmtPage />) },
      { path: 'admin-mgmt/access-logs', element: withPermission(PERMISSIONS.adminMgmt.view, <AdminMgmtPage />) },
      { path: 'admin-mgmt/activity-logs', element: withPermission(PERMISSIONS.adminMgmt.view, <AdminMgmtPage />) },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
