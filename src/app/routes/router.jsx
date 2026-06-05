import React, { createElement } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// ── Admin portal
import { MainLayout } from '@/app/layout/MainLayout';
import { AdminAuthGuard } from '@/app/guards/AdminAuthGuard';
import { ClientAuthGuard } from '@/app/guards/ClientAuthGuard';
import { PermissionGuard } from '@/app/guards/PermissionGuard';
import { adminRedirectRoutes, adminRouteModules } from '@/config/routes/admin-routes.config';

// ── Customer portal layout
import { ClientLayout } from '@/client/layout/ClientLayout';

// ── Auth page
import { LoginPage } from '@/features/auth/pages/LoginPage';

// ── Admin feature pages (unchanged)
import { DashboardPage } from '@/features/dashboard';
import { UsersPage, MT5QueuePage, UserDetailPage, KYCQueuePage, UsersAuditPage, MT5AccountReviewPage } from '@/features/users';
import { DepositsPage, WithdrawalsPage, TransactionsPage, FailedPaymentsPage, ApprovalsPage, DepositDetailPage, WithdrawalDetailPage } from '@/features/finance';
import { TradingAccountsPage, OrdersPage, PositionsPage, TradeHistoryPage, ExecutionLogsPage } from '@/features/trading';
import { CopyTradingPage, CopyTradingDetailPage } from '@/features/copy-trading';
import { IBSystemPage } from '@/features/ib-system';
import { PropTradingPage } from '@/features/prop-trading';
import { ReportsOverviewPage, FinanceReportsPage, TradingReportsPage, UserReportsPage, SystemReportsPage, ExportCenterPage } from '@/features/reports';
import { SupportPage, TicketDetailPage } from '@/features/support';
import { SettingsPage } from '@/features/settings';
import { RolesPermissionsPage } from '@/features/roles-permissions';
import { GroupWorkspacePage } from '@/features/group-management';
import { NotFoundPage } from '@/app/pages/NotFoundPage';

// ── Customer feature pages
import { ClientDashboardPage } from '@/features/client-dashboard/pages/ClientDashboardPage';
import { AccountCenterPage } from '@/features/account-center';
import { WalletsPage }           from '@/features/client-finance/pages/WalletsPage';
import { DepositPage }           from '@/features/client-finance/pages/DepositPage';
import { WithdrawPage }          from '@/features/client-finance/pages/WithdrawPage';
import { PaymentMethodsPage }    from '@/features/client-finance/pages/PaymentMethodsPage';
import { LimitsFeesPage }        from '@/features/client-finance/pages/LimitsFeesPage';
import { ClientTransactionsPage } from '@/features/client-finance/pages/ClientTransactionsPage';
import { SupportTicketsPage }   from '@/features/client-support/pages/SupportTicketsPage';
import { NewTicketPage }        from '@/features/client-support/pages/NewTicketPage';
import { ClientTicketDetailPage } from '@/features/client-support/pages/TicketDetailPage';

/* ─────────────────────────────────────────────────────────
   ADMIN PAGE REGISTRY
───────────────────────────────────────────────────────── */
const adminPageRegistry = {
  'dashboard/dashboard':                   DashboardPage,
  'users/users-list':                      UsersPage,
  'users/kyc-queue':                       KYCQueuePage,
  'users/mt5-queue':                       MT5QueuePage,
  'users/mt5-review':                      MT5AccountReviewPage,
  'users/user-detail':                     UserDetailPage,
  'users/users-audit':                     UsersAuditPage,
  'finance/deposits':                      DepositsPage,
  'finance/deposit-detail':                DepositDetailPage,
  'finance/withdrawals':                   WithdrawalsPage,
  'finance/withdrawal-detail':             WithdrawalDetailPage,
  'finance/transactions':                  TransactionsPage,
  'finance/failed-payments':               FailedPaymentsPage,
  'finance/approvals':                     ApprovalsPage,
  'trading/trading-accounts':              TradingAccountsPage,
  'trading/orders':                        OrdersPage,
  'trading/positions':                     PositionsPage,
  'trading/trade-history':                 TradeHistoryPage,
  'trading/execution-logs':                ExecutionLogsPage,
  'copy-trading/strategies':               CopyTradingPage,
  'copy-trading/providers':                CopyTradingPage,
  'copy-trading/followers':                CopyTradingPage,
  'copy-trading/subscriptions':            CopyTradingPage,
  'copy-trading/performance':              CopyTradingPage,
  'copy-trading/logs':                     CopyTradingPage,
  'copy-trading/copy-trading-detail':      CopyTradingDetailPage,
  'ib-system/ib-system-workspace':         IBSystemPage,
  'group-management/workspace':            GroupWorkspacePage,
  'prop-trading/prop-trading-workspace':   PropTradingPage,
  'reports/overview':                      ReportsOverviewPage,
  'reports/finance':                       FinanceReportsPage,
  'reports/trading':                       TradingReportsPage,
  'reports/users':                         UserReportsPage,
  'reports/system':                        SystemReportsPage,
  'reports/exports':                       ExportCenterPage,
  'support/support-workspace':             SupportPage,
  'support/ticket-detail':                 TicketDetailPage,
  'settings/settings-workspace':           SettingsPage,
  'admin-mgmt/roles-permissions-workspace': RolesPermissionsPage,
  'account/account-center':                AccountCenterPage,
};

function withPermission(permission, PageComponent) {
  return (
    <PermissionGuard permission={permission}>
      {createElement(PageComponent)}
    </PermissionGuard>
  );
}

function cleanAdminPath(path) {
  if (path.startsWith('/admin/')) {
    return path.substring(7);
  }
  if (path.startsWith('/admin')) {
    return path.substring(6);
  }
  if (path.startsWith('/')) {
    return path.substring(1);
  }
  return path;
}

function buildAdminRoutes() {
  return adminRouteModules.flatMap((module) =>
    module.routes.map((route) => {
      const PageComponent = adminPageRegistry[route.pageKey];
      if (!PageComponent) {
        throw new Error(`Missing page for admin route key: ${route.pageKey}`);
      }
      // Index route (dashboard)
      if (route.path === '') {
        return { index: true, element: withPermission(route.permission, PageComponent) };
      }
      return { path: cleanAdminPath(route.path), element: withPermission(route.permission, PageComponent) };
    }),
  );
}

/* ─────────────────────────────────────────────────────────
   UNIFIED ROUTER
───────────────────────────────────────────────────────── */
export const appRouter = createHashRouter([
  // Root → login
  { index: true, element: <Navigate to="/login" replace /> },

  // Login (public)
  { path: 'login', element: <LoginPage /> },

  // ── Admin Portal
  {
    path: 'admin',
    element: (
      <AdminAuthGuard>
        <MainLayout />
      </AdminAuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // Redirect shortcuts  (e.g. /admin/finance → /admin/finance/deposits)
      ...adminRedirectRoutes.map((r) => {
        const cleanTo = r.to.startsWith('/admin') ? r.to : `/admin${r.to}`;
        return {
          path: cleanAdminPath(r.path),
          element: <Navigate to={cleanTo} replace />,
        };
      }),
      // All module routes
      ...buildAdminRoutes(),
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ── Customer Portal
  {
    path: 'client',
    element: (
      <ClientAuthGuard>
        <ClientLayout />
      </ClientAuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true,                      element: <ClientDashboardPage /> },
      { path: 'account',                  element: <Navigate to="/client/account/overview" replace /> },
      { path: 'account/:tab',             element: <AccountCenterPage /> },
      { path: 'finance/wallets',           element: <WalletsPage /> },
      { path: 'finance/deposit',           element: <DepositPage /> },
      { path: 'finance/withdraw',          element: <WithdrawPage /> },
      { path: 'finance/payment-methods',   element: <PaymentMethodsPage /> },
      { path: 'finance/limits',            element: <LimitsFeesPage /> },
      { path: 'finance/transactions',      element: <ClientTransactionsPage /> },
      { path: 'support/tickets',          element: <SupportTicketsPage /> },
      { path: 'support/tickets/new',      element: <NewTicketPage /> },
      { path: 'support/tickets/:id',      element: <ClientTicketDetailPage /> },
      { path: '*',                        element: <NotFoundPage /> },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/login" replace /> },
]);

// Keep legacy named export for any lingering imports (will be removed later)
export const adminRouter = appRouter;
