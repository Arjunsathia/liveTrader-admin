import React, { useState } from 'react';
import { ChevronRight, PlusCircle, RefreshCw } from 'lucide-react';
import { PageShell } from '../../../components/layout/PageShell';
import { TradingAccountsGrid } from '../components/TradingAccountsGrid';
import { TradingAccountsTable } from '../components/TradingAccountsTable';
import { TradingAccountsConsole } from '../components/TradingAccountsConsole';
import { TradingAccountsDrawer } from '../components/TradingAccountsDrawer';

const MOCK_ACCOUNTS = [
  {
    login: '88100249',
    user: 'Arjun Sathia',
    uid: 'U-499201',
    server: 'MT5-PRIME-01 (EU Node)',
    group: 'REAL_RAW_SPREAD',
    leverage: '1:500',
    equity: '$142,005.12',
    balance: '$141,800.00',
    margin: '$2,800.00',
    freeMargin: '$139,205.12',
    marginLvl: '5071%',
    status: 'LIVE',
    lastSync: '2 mins ago',
  },
  {
    login: '88100562',
    user: 'Arjun Sathia',
    uid: 'U-499201',
    server: 'MT5-STND-04 (US Node)',
    group: 'REAL_STANDARD',
    leverage: '1:100',
    equity: '$42,099.00',
    balance: '$42,099.00',
    margin: '$0.00',
    freeMargin: '$42,099.00',
    marginLvl: '—',
    status: 'DISCONNECTED',
    lastSync: '14 hours ago',
  },
  {
    login: '88100918',
    user: 'Arjun Sathia',
    uid: 'U-499201',
    server: 'MT5-PRIME-01 (EU Node)',
    group: 'REAL_RAW_SPREAD',
    leverage: '1:500',
    equity: '$100,000.33',
    balance: '$100,000.00',
    margin: '$2,000.00',
    freeMargin: '$98,000.33',
    marginLvl: '5000%',
    status: 'LIVE',
    lastSync: 'Just now',
  },
];

export function TradingAccountsPage() {
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [stats, setStats] = useState({
    equity: '$284,102.45',
    equityChange: '+4.2%',
    activeAccounts: '03',
    allowedAccounts: '5',
    riskLevel: 'High',
    marginLevel: '112%',
    latency: '14ms',
    node: 'NY4',
  });
  const [filter, setFilter] = useState('ALL');
  const [sort, setSort] = useState('EQUITY');
  const [activeDrawerAccount, setActiveDrawerAccount] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddNewAccount = () => {
    const nextLogin = String(Math.floor(10000000 + Math.random() * 90000000));
    const newAcct = {
      login: nextLogin,
      user: 'Arjun Sathia',
      uid: 'U-499201',
      server: 'MT5-PRIME-01 (EU Node)',
      group: 'REAL_RAW_SPREAD',
      leverage: '1:100',
      equity: '$10,000.00',
      balance: '$10,000.00',
      margin: '$0.00',
      freeMargin: '$10,000.00',
      marginLvl: '—',
      status: 'LIVE',
      lastSync: 'Just now',
    };
    setAccounts((prev) => [newAcct, ...prev]);
    setStats((prev) => ({
      ...prev,
      equity: `$${(parseFloat(prev.equity.replace(/[$,]/g, '')) + 10000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      activeAccounts: String(prev.activeAccounts * 1 + 1).padStart(2, '0'),
    }));
    triggerToast(`Added Account #${nextLogin} to inventory`);
  };

  const handleGlobalSync = () => {
    triggerToast('MT5 Dealing Cluster Synchronizing...');
    setStats((prev) => ({
      ...prev,
      latency: `${Math.floor(10 + Math.random() * 8)}ms`,
      marginLevel: `${110 + Math.floor(Math.random() * 20)}%`,
    }));
  };

  const handleSyncSingleAccount = (row) => {
    setAccounts((prev) =>
      prev.map((item) =>
        item.login === row.login ? { ...item, lastSync: 'Just now', status: 'LIVE' } : item
      )
    );
    triggerToast(`Cluster handshake refreshed for #${row.login}`);
  };

  const handleResetPassword = (row) => {
    triggerToast(`Password reset instruction queued for #${row.login}`);
  };

  const handleSaveChangesFromDrawer = (updatedAcct) => {
    setAccounts((prev) =>
      prev.map((item) => (item.login === updatedAcct.login ? updatedAcct : item))
    );
    triggerToast(`Updated MT5 Account #${updatedAcct.login}`);
  };

  const filteredAccounts = accounts.filter((item) => {
    if (filter === 'LIVE') return item.status === 'LIVE';
    return true;
  });

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sort === 'EQUITY') {
      return parseFloat(b.equity.replace(/[$,]/g, '')) - parseFloat(a.equity.replace(/[$,]/g, ''));
    }
    return b.login.localeCompare(a.login);
  });

  return (
    <PageShell className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[300] bg-surface-elevated border border-brand/20 text-text text-[11px] font-bold px-4 py-3 rounded-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-fade-in flex items-center gap-2.5">
          <span className="w-2 h-2 bg-positive rounded-full animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[10px] text-text-muted/40 uppercase font-black tracking-[0.12em]">
            <span>Users</span>
            <ChevronRight size={9} />
            <span>User Detail</span>
            <ChevronRight size={9} />
            <span className="text-brand">MT5 Management</span>
          </nav>
          <h2 className="text-[22px] font-black tracking-[-0.04em] text-text mt-1.5">
            User Accounts <span className="text-text-muted/35 font-light">/</span>{' '}
            <span className="text-text-muted/60">#499201</span>
          </h2>
        </div>

        {/* Command Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Cluster Status Pill */}
          <div className="flex items-center gap-2 px-3 h-8 rounded-[8px] border border-positive/20 bg-positive/[0.04] text-[10px] font-bold text-positive">
            <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
            {stats.node} · {stats.latency} · HEALTHY
          </div>

          <button
            type="button"
            onClick={handleAddNewAccount}
            className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[12px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            <PlusCircle size={13} /> New MT5 Account
          </button>
          <button
            type="button"
            onClick={handleGlobalSync}
            className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[12px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            <RefreshCw size={13} className="animate-spin-slow" /> Global Sync
          </button>
        </div>
      </header>

      {/* KPI Bento Strip */}
      <TradingAccountsGrid stats={stats} />

      {/* MT5 Inventory Table */}
      <TradingAccountsTable
        items={sortedAccounts}
        onRowClick={setActiveDrawerAccount}
        onSync={handleSyncSingleAccount}
        onResetPassword={handleResetPassword}
        activeFilter={filter}
        activeSort={sort}
        onChangeFilter={setFilter}
        onChangeSort={setSort}
      />

      {/* Operations Terminal */}
      <TradingAccountsConsole
        onTriggerControl={(action) => triggerToast(`Global Command Issued: ${action}`)}
      />

      {/* Details Side-Drawer */}
      <TradingAccountsDrawer
        open={!!activeDrawerAccount}
        row={activeDrawerAccount}
        onClose={() => setActiveDrawerAccount(null)}
        onSave={handleSaveChangesFromDrawer}
        onSync={handleSyncSingleAccount}
        onResetPassword={handleResetPassword}
      />
    </PageShell>
  );
}

export default TradingAccountsPage;