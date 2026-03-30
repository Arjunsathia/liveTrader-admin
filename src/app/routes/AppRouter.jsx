import { createHashRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../../layout/MainLayout';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { UserListPage } from '../../features/users/pages/UserListPage';
import { FinancePage } from '../../features/finance/pages/FinancePage';
import { TradingPage } from '../../features/trading/pages/TradingPage';
import { CopyTradingPage } from '../../features/copy-trading/pages/CopyTradingPage';
import { IBSystemPage } from '../../features/ib-system/pages/IBSystemPage';
import { ReportsPage } from '../../features/reports/pages/ReportsPage';
import { SupportPage } from '../../features/support/pages/SupportPage';
import { SettingsPage } from '../../features/settings/pages/SettingsPage';
import { AdminMgmtPage } from '../../features/admin-mgmt/pages/AdminMgmtPage';

export const appRouter = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '', element: <DashboardPage /> },
      { path: 'dashboard/analytics', element: <DashboardPage /> },
      { path: 'dashboard/alerts', element: <DashboardPage /> },
      { path: 'dashboard/activity', element: <DashboardPage /> },

      { path: 'users/list', element: <UserListPage /> },
      { path: 'users/details/:id', element: <UserListPage /> },
      { path: 'users/kyc', element: <UserListPage /> },
      { path: 'users/activity', element: <UserListPage /> },
      { path: 'users/wallet', element: <UserListPage /> },
      { path: 'users/risk', element: <UserListPage /> },

      { path: 'finance/deposits', element: <FinancePage /> },
      { path: 'finance/withdrawals', element: <FinancePage /> },
      { path: 'finance/transactions', element: <FinancePage /> },
      { path: 'finance/approvals', element: <FinancePage /> },

      { path: 'trading/accounts', element: <TradingPage /> },
      { path: 'trading/orders', element: <TradingPage /> },
      { path: 'trading/positions', element: <TradingPage /> },
      { path: 'trading/history', element: <TradingPage /> },

      { path: 'copy-trading/strategies', element: <CopyTradingPage /> },
      { path: 'copy-trading/providers', element: <CopyTradingPage /> },
      { path: 'copy-trading/followers', element: <CopyTradingPage /> },
      { path: 'copy-trading/performance', element: <CopyTradingPage /> },

      { path: 'ib-system/referrals', element: <IBSystemPage /> },
      { path: 'ib-system/commissions', element: <IBSystemPage /> },
      { path: 'ib-system/payouts', element: <IBSystemPage /> },

      { path: 'reports/finance', element: <ReportsPage /> },
      { path: 'reports/trading', element: <ReportsPage /> },
      { path: 'reports/users', element: <ReportsPage /> },
      { path: 'reports/export', element: <ReportsPage /> },

      { path: 'support/tickets', element: <SupportPage /> },
      { path: 'support/open', element: <SupportPage /> },
      { path: 'support/closed', element: <SupportPage /> },

      { path: 'settings/api', element: <SettingsPage /> },
      { path: 'settings/payments', element: <SettingsPage /> },
      { path: 'settings/kyc', element: <SettingsPage /> },
      { path: 'settings/trading', element: <SettingsPage /> },

      { path: 'admin-mgmt/users', element: <AdminMgmtPage /> },
      { path: 'admin-mgmt/roles', element: <AdminMgmtPage /> },
      { path: 'admin-mgmt/logs', element: <AdminMgmtPage /> },

      { path: 'users', element: <Navigate to="/users/list" replace /> },
      { path: 'finance', element: <Navigate to="/finance/deposits" replace /> },
      { path: 'trading', element: <Navigate to="/trading/accounts" replace /> },
      { path: 'copy-trading', element: <Navigate to="/copy-trading/strategies" replace /> },
      { path: 'ib-system', element: <Navigate to="/ib-system/referrals" replace /> },
      { path: 'reports', element: <Navigate to="/reports/finance" replace /> },
      { path: 'support', element: <Navigate to="/support/tickets" replace /> },
      { path: 'settings', element: <Navigate to="/settings/api" replace /> },
      { path: 'admin-mgmt', element: <Navigate to="/admin-mgmt/users" replace /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
