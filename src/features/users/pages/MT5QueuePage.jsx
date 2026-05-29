import React, { useMemo, useState } from 'react';
import { Download, Layers, Landmark, Clock, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../components/layout/PageShell';
import { useDrawerState } from '../../../hooks/useDrawerState';
import { useTableState } from '../../../hooks/useTableState';
import { TableToolbar } from '../../../components/common/table';
import { exportRows } from '../../../utils/exporters';
import { usersService } from '../services/userService';
import { UsersMt5Table } from '../components/UsersTable';
import { UsersKPIGrid } from '../components/UsersKPIGrid';

const PAGE = {
  accent: 'var(--brand)',
  eyebrow: 'Broker Integration',
  title: 'MT5 Accounts Bridge',
  description: 'Monitor meta-trader terminals, connection latency, margins, and dealing desk bridges.',
};

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

function MT5QueuePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serverFilter, setServerFilter] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load unique servers for dynamic triage dropdowns
  const servers = useMemo(() => {
    const list = usersService.listMt5Accounts();
    const unique = [...new Set(list.map((item) => item.server))].filter(Boolean);
    return unique.sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const filteredMt5 = useMemo(
    () => {
      let rows = filterBySearch(usersService.listMt5Accounts(), search, ['login', 'user', 'server', 'group', 'status']);
      if (statusFilter !== 'all') {
        rows = rows.filter((r) => r.status === statusFilter);
      }
      if (serverFilter !== 'all') {
        rows = rows.filter((r) => r.server === serverFilter);
      }
      return rows;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search, statusFilter, serverFilter, refreshTrigger]
  );

  // Compute real-time MT5 bridge telemetry for the scoreboard
  const kpis = useMemo(() => {
    const list = usersService.listMt5Accounts();
    const totalBalance = list.reduce((acc, curr) => {
      const val = parseFloat(String(curr.balance || '0').replace(/[$,]/g, '')) || 0;
      return acc + val;
    }, 0);
    const uniqueServers = [...new Set(list.map((t) => t.server))].filter(Boolean);
    
    return [
      { label: 'Total MT5 Terminals', value: list.length, subtext: 'provisioned instances', trend: 'Active Bridge', positive: true, Icon: Layers, accent: 'var(--brand)' },
      { label: 'Liquidation Pool', value: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, subtext: 'cumulative margin balances', trend: 'Direct Custody', positive: true, Icon: Landmark, accent: 'var(--positive)' },
      { label: 'Bridge Servers', value: uniqueServers.length, subtext: 'active gateway server nodes', trend: 'LD4/NY4 Route', positive: true, Icon: Cpu, accent: 'var(--cyan)' },
      { label: 'Gateway Health', value: '99.8%', subtext: 'cluster latency handshake', trend: 'Stable ping', positive: true, Icon: Clock, accent: 'var(--warning)', pulse: true },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredMt5, refreshTrigger]);

  const mt5Table = useTableState(filteredMt5, { searchFields: [], initialPageSize: 10 });

  return (
    <PageShell>
      <div className="space-y-5">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] leading-tight text-text">
              {PAGE.title}
            </h2>
            <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-lg">
              {PAGE.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => exportRows(filteredMt5, `mt5-accounts.csv`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export Inventory
            </button>
          </div>
        </header>

        {/* ── MT5 KPI Telemetry scorecard Grid ── */}
        <UsersKPIGrid items={kpis} />

        {/* ── Table registry panel ── */}
        <Card padding={false}>
          <TableToolbar
            title="MT5 Accounts Inventory"
            count={filteredMt5.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(val) => { setSearch(val); mt5Table.setPage(1); }}
            searchPlaceholder="Search terminals..."
            filters={
              <>
                {/* 1. Status Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0 select-none">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); mt5Table.setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '76px' }}
                  >
                    <option value="all">ALL</option>
                    {['CONNECTED', 'DISCONNECTED', 'SYNC_DELAY', 'BLOCKED', 'READONLY'].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Server Node Filter */}
                {servers.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0 select-none">Server:</span>
                    <select
                      value={serverFilter}
                      onChange={(e) => { setServerFilter(e.target.value); mt5Table.setPage(1); }}
                      className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                      style={{ minWidth: '76px' }}
                    >
                      <option value="all">ALL</option>
                      {servers.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            }
          />

          <UsersMt5Table
            tableState={mt5Table}
            onOpenUser={(nextUserId, nextTab) => navigate(`/users/${nextUserId}${nextTab ? `/${nextTab}` : ''}`)}
            onOpenMt5={(entry) => navigate(`/users/mt5/${entry.login}`)}
          />
        </Card>

      </div>

      {/* ── Toast ── */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[300] flex items-center gap-3 bg-surface-elevated border border-brand/20 px-4 py-3 rounded-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.45)] animate-fade-in">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-positive" />
          </span>
          <span className="text-[11px] font-bold text-text">{toastMessage}</span>
        </div>
      )}
    </PageShell>
  );
}
export default MT5QueuePage;
