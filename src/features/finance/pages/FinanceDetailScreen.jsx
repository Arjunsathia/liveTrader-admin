/**
 * finance/pages/FinanceDetailScreen.jsx
 * Finance Module shell — mounts the correct sub-page based on the URL.
 * All data, components, and page logic live in their own files.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowDownLeft, ArrowLeftRight, ArrowUpRight,
  CheckCircle2, CircleDollarSign, PackageX,
} from 'lucide-react';

import { DepositsPage }      from './DepositsPage';
import { WithdrawalsPage }   from './WithdrawalsPage';
import { TransactionsPage }  from './TransactionsPage';
import { FailedPaymentsPage } from './FailedPaymentsPage';
import { ApprovalsPage }     from './ApprovalsPage';

import {
  depositsData, withdrawalsData,
  failedPaymentsData, approvalsData,
} from '../data/financeMockData';

/* ── URL slug ↔ internal page key maps ─────────────────────── */
const SLUG_MAP = {
  deposits:         'deposits',
  withdrawals:      'withdrawals',
  transactions:     'transactions',
  'failed-payments':'failed',
  approvals:        'approvals',
};

const PAGE_SLUG = {
  deposits:     'deposits',
  withdrawals:  'withdrawals',
  transactions: 'transactions',
  failed:       'failed-payments',
  approvals:    'approvals',
};

const PAGE_TITLES = {
  deposits:     'Deposits',
  withdrawals:  'Withdrawals',
  transactions: 'Transactions',
  failed:       'Failed Payments',
  approvals:    'Approvals',
};

const NAV_ITEMS = [
  {
    id: 'deposits',     label: 'Deposits',      Icon: ArrowDownLeft,
    badge: depositsData.filter(d => d.status === 'PENDING').length,
  },
  {
    id: 'withdrawals',  label: 'Withdrawals',   Icon: ArrowUpRight,
    badge: withdrawalsData.filter(d => ['PENDING', 'FROZEN'].includes(d.status)).length,
  },
  { id: 'transactions', label: 'Transactions',  Icon: ArrowLeftRight },
  {
    id: 'failed',       label: 'Failed Payments', Icon: PackageX,
    badge: failedPaymentsData.filter(f => f.status === 'UNRESOLVED').length, urgent: true,
  },
  {
    id: 'approvals',    label: 'Approvals',     Icon: CheckCircle2,
    badge: approvalsData.filter(a => a.status === 'PENDING').length, urgent: true,
  },
];

/* ── Module Shell ───────────────────────────────────────────── */
export function FinanceModule() {
  const location = useLocation();
  const navigate  = useNavigate();

  const urlSlug = location.pathname.split('/')[2] || 'deposits';
  const [page, setPage] = useState(SLUG_MAP[urlSlug] ?? 'deposits');

  const goTo = (id) => {
    setPage(id);
    navigate(`/finance/${PAGE_SLUG[id]}`);
  };

  /* Sync when sidebar navigates by URL */
  useEffect(() => {
    const s      = location.pathname.split('/')[2] || 'deposits';
    const mapped = SLUG_MAP[s];
    if (mapped && mapped !== page) setPage(mapped);
  }, [location.pathname]);

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

      {/* Page content */}
      <div className="space-y-5">{renderPage()}</div>
    </div>
  );
}

/* Aliases so router.jsx import { FinanceScreen } keeps working */
export { FinanceModule as FinanceScreen };
export default FinanceModule;