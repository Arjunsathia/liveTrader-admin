import React, { useState } from 'react';
import { RefreshCw, KeyRound, ChevronRight, Copy, Check, Clock } from 'lucide-react';
import { MainTable, TableToolbar } from '../../../components/common/table';

export function TradingAccountsTable({
  items,
  onRowClick,
  onSync,
  onResetPassword,
  activeFilter = 'ALL',
  activeSort = 'EQUITY',
  onChangeFilter,
  onChangeSort,
}) {
  const [search, setSearch] = useState('');
  const [copiedLogin, setCopiedLogin] = useState(null);

  const filtered = search.trim()
    ? items.filter(
      (r) =>
        r.login.includes(search) ||
        r.user.toLowerCase().includes(search.toLowerCase()) ||
        r.server.toLowerCase().includes(search.toLowerCase()) ||
        (r.group || '').toLowerCase().includes(search.toLowerCase())
    )
    : items;

  const handleCopyLogin = (e, login) => {
    e.stopPropagation();
    navigator.clipboard.writeText(login);
    setCopiedLogin(login);
    setTimeout(() => setCopiedLogin(null), 1500);
  };

  const columns = [
    {
      key: 'login',
      label: 'Account ID',
      render: (val, row) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-[13px] text-brand">{row.login}</span>
            <button
              type="button"
              onClick={(e) => handleCopyLogin(e, row.login)}
              className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted/50 hover:text-brand transition-all cursor-pointer"
              title="Copy Login"
            >
              {copiedLogin === row.login ? <Check size={10} /> : <Copy size={10} />}
            </button>
          </div>
          <div className="text-[9.5px] text-text-muted/40 font-mono mt-0.5">{row.uid}</div>
        </div>
      ),
    },
    {
      key: 'server',
      label: 'Server',
      render: (val, row) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: row.server?.includes('EU') ? 'var(--brand)' : 'var(--warning)',
                boxShadow: `0 0 5px ${row.server?.includes('EU') ? 'var(--brand)' : 'var(--warning)'}`,
              }}
            />
            <span className="text-[12px] font-semibold text-text">{row.server}</span>
          </div>
          <div className="text-[9.5px] text-text-muted/40 uppercase tracking-wide mt-0.5 ml-3">
            {row.server?.includes('EU') ? 'EU Node' : row.server?.includes('US') ? 'US Node' : 'APAC Node'}
          </div>
        </div>
      ),
    },
    {
      key: 'group',
      label: 'Group / Type',
      render: (val, row) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand/8 text-brand text-[10px] font-extrabold rounded-[5px] border border-brand/18">
          <span className="w-1 h-1 rounded-full bg-brand/60" />
          {(row.group || 'UNKNOWN').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'leverage',
      label: 'Leverage',
      render: (val) => <span className="font-mono text-[12px] text-text-muted/70">{val}</span>,
    },
    {
      key: 'equity',
      label: 'Equity (USD)',
      render: (val, row) => {
        const equity = parseFloat((row.equity || '$0').replace(/[$,]/g, ''));
        const balance = parseFloat((row.balance || '$0').replace(/[$,]/g, ''));
        const delta = equity - balance;
        const deltaSign = delta >= 0 ? '+' : '';
        return (
          <div>
            <div className="font-bold font-mono text-[13px] text-text">{row.equity}</div>
            {!isNaN(delta) && delta !== 0 && (
              <div
                className="text-[9.5px] font-mono font-semibold mt-0.5"
                style={{ color: delta >= 0 ? 'var(--positive)' : 'var(--negative)' }}
              >
                {deltaSign}${Math.abs(delta).toFixed(2)} vs bal.
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (val, row) => {
        const isLive = row.status === 'LIVE' || row.status === 'ACTIVE';
        const statusColor = isLive ? 'var(--positive)' : 'var(--negative)';
        const statusText = isLive ? 'LIVE' : row.status || 'DISCONNECTED';
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[5px] text-[10px] font-black"
            style={{
              color: statusColor,
              background: `color-mix(in srgb, ${statusColor} 10%, transparent)`,
              border: `1px solid color-mix(in srgb, ${statusColor} 22%, transparent)`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: statusColor,
                boxShadow: isLive ? `0 0 6px ${statusColor}` : 'none',
              }}
            />
            {statusText}
          </span>
        );
      },
    },
    {
      key: 'lastSync',
      label: 'Last Sync',
      render: (val) => (
        <div className="flex items-center gap-1 text-[11px] text-text-muted/55 font-mono">
          <Clock size={9} className="shrink-0 text-text-muted/35" />
          {val}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (val, row) => (
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onSync?.(row)}
            className="h-7 w-7 flex items-center justify-center rounded-full border border-brand/20 bg-brand/5 hover:bg-brand/15 text-brand transition-all cursor-pointer"
            title="Sync Now"
          >
            <RefreshCw size={11} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => onResetPassword?.(row)}
            className="h-7 w-7 flex items-center justify-center rounded-full border border-negative/20 bg-negative/5 hover:bg-negative/15 text-negative transition-all cursor-pointer"
            title="Reset Password"
          >
            <KeyRound size={11} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => onRowClick?.(row)}
            className="h-7 w-7 flex items-center justify-center rounded-full border border-border/20 bg-surface-elevated hover:border-brand/30 hover:text-brand text-text-muted transition-all cursor-pointer"
            title="Open Details"
          >
            <ChevronRight size={11} strokeWidth={2} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-surface-elevated rounded-[12px] overflow-hidden shadow-card-subtle border border-border/20">
      <TableToolbar
        title="MT5 Account Inventory"
        count={filtered.length}
        accentColor="var(--brand)"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search accounts…"
        filters={
          <div className="flex items-center gap-2">
            {/* Filter Chip */}
            <button
              type="button"
              onClick={() => onChangeFilter?.(activeFilter === 'ALL' ? 'LIVE' : 'ALL')}
              className={`px-2.5 py-1 text-[10px] font-black rounded-[6px] border transition-all cursor-pointer uppercase tracking-wider ${activeFilter === 'LIVE'
                  ? 'bg-positive/10 text-positive border-positive/30'
                  : 'bg-surface-bright/20 text-text-muted border-border/20 hover:border-border/40'
                }`}
            >
              {activeFilter === 'LIVE' ? '● Live Only' : '○ All'}
            </button>

            {/* Sort Chip */}
            <button
              type="button"
              onClick={() => onChangeSort?.(activeSort === 'EQUITY' ? 'LOGIN' : 'EQUITY')}
              className="px-2.5 py-1 bg-surface-bright/20 hover:bg-surface-bright/35 border border-border/20 text-[10px] font-bold rounded-[6px] text-text-muted transition-all cursor-pointer uppercase tracking-wider hover:border-border/40"
            >
              ↕ {activeSort === 'EQUITY' ? 'Equity' : 'Login'}
            </button>
          </div>
        }
      />

      <MainTable
        columns={columns}
        data={filtered}
        onRowClick={onRowClick}
        emptyTitle="No accounts match your filter."
        rowClassName="hover:bg-brand/5 hover:border-l-brand"
      />
    </section>
  );
}
