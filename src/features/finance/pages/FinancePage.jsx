/**
 * finance/pages/FinancePage.jsx
 *
 * Finance Module shell — mounts the correct sub-page based on the URL.
 * All data, components, and page logic live in their own files.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowDownLeft, ArrowLeftRight, ArrowUpRight,
  CheckCircle2, PackageX,
} from 'lucide-react';

import DepositsPage from './DepositsPage';
import WithdrawalsPage from './WithdrawalsPage';
import TransactionsPage from './TransactionsPage';
import FailedPaymentsPage from './FailedPaymentsPage';
import ApprovalsPage from './ApprovalsPage';

import {
  depositsData, withdrawalsData,
  failedPaymentsData, approvalsData,
} from '@/config/constants/finance/mockData';

/* ── URL slug ↔ internal page key map ──────────────────────────────────── */
const SLUG_MAP = {
  deposits:          'deposits',
  withdrawals:       'withdrawals',
  transactions:      'transactions',
  'failed-payments': 'failed',
  approvals:         'approvals',
};

/* ── Nav items (kept for potential future sidebar/tab use) ─────────────── */
const FINANCE_NAV_ITEMS = [
  {
    id: 'deposits',     label: 'Deposits',       Icon: ArrowDownLeft,
    badge: depositsData.filter(d => d.status === 'PENDING').length,
  },
  {
    id: 'withdrawals',  label: 'Withdrawals',    Icon: ArrowUpRight,
    badge: withdrawalsData.filter(d => ['PENDING', 'FROZEN'].includes(d.status)).length,
  },
  { id: 'transactions', label: 'Transactions',   Icon: ArrowLeftRight },
  {
    id: 'failed',       label: 'Failed Payments', Icon: PackageX,
    badge: failedPaymentsData.filter(f => f.status === 'UNRESOLVED').length, urgent: true,
  },
  {
    id: 'approvals',    label: 'Approvals',      Icon: CheckCircle2,
    badge: approvalsData.filter(a => a.status === 'PENDING').length, urgent: true,
  },
];

/* ── Module Shell ───────────────────────────────────────────────────────── */
function FinancePage() {
  const location = useLocation();

  const urlSlug = location.pathname.split('/')[2] || 'deposits';
  const page    = SLUG_MAP[urlSlug] ?? 'deposits';

  const renderPage = () => {
    switch (page) {
      case 'deposits':     return <DepositsPage />;
      case 'withdrawals':  return <WithdrawalsPage />;
      case 'transactions': return <TransactionsPage />;
      case 'failed':       return <FailedPaymentsPage />;
      case 'approvals':    return <ApprovalsPage />;
      default:             return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="space-y-5">{renderPage()}</div>
    </div>
  );
}

export default FinancePage;
