import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { PageShell } from '../../../components/layout/PageShell';
import { KpiCard } from '../../../components/cards';
import { MainTable, TableToolbar } from '../../../components/common/table';
import { TradingDrawer } from '../components/TradingDrawer';
import { PositionDetailsDrawer } from '../components/TradingDetailPanels';
import { useWorkspace } from '@/hooks/useWorkspace';
import { positionsConfig } from '@/config/constants/trading/workspaces/positions.workspace';
import { exportRows } from '../../../utils/exporters';
import { useDrawerState } from '@/hooks/useDrawerState';

const PAGE = {
  accent: 'var(--positive)',
  eyebrow: 'Trading Operations',
  title: 'Live Positions',
  description: 'Real-time floating positions across all MT5 accounts — exposure, P&L, and margin.',
};

function PositionsPage() {
  const ws = useWorkspace(positionsConfig);
  const drawerRowState = useDrawerState(null);
  const [actionDone, setActionDone] = useState(null);

  const handleAction = (label) => setActionDone(label);

  const columns = [
    { key: 'ticket', label: 'Ticket', render: (val) => <span className="font-mono text-[11px] font-bold text-brand">{val}</span> },
    {
      key: 'user',
      label: 'User',
      render: (_, row) => (
        <div>
          <div className="text-[12px] font-semibold text-text">{row.user}</div>
          <div className="text-[9.5px] font-mono text-text-muted/45">{row.uid}</div>
        </div>
      ),
    },
    { key: 'symbol', label: 'Symbol', render: (val) => <span className="font-mono text-[12px] font-semibold text-text">{val}</span> },
    {
      key: 'side',
      label: 'Side',
      render: (val) => {
        const isBuy = val === 'BUY';
        const sideColor = isBuy ? 'var(--positive)' : 'var(--negative)';
        return (
          <span
            className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] font-black"
            style={{ color: sideColor, background: `color-mix(in srgb, ${sideColor} 10%, transparent)` }}
          >
            {isBuy ? '▲' : '▼'} {val}
          </span>
        );
      },
    },
    { key: 'size', label: 'Size', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    { key: 'openPrice', label: 'Open', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    { key: 'currPrice', label: 'Current', render: (val) => <span className="font-mono text-[12px] text-text">{val}</span> },
    {
      key: 'pnl',
      label: 'Float P&L',
      render: (val) => {
        const pnlPositive = String(val).startsWith('+');
        const pnlColor = pnlPositive ? 'var(--positive)' : 'var(--negative)';
        return (
          <span
            className="font-mono text-[13px] font-black"
            style={{ color: pnlColor, textShadow: `0 0 12px color-mix(in srgb, ${pnlColor} 40%, transparent)` }}
          >
            {val}
          </span>
        );
      },
    },
    { key: 'swap', label: 'Swap', render: (val) => <span className="font-mono text-[11px] text-text-muted/55">{val}</span> },
    { key: 'margin', label: 'Margin', render: (val) => <span className="font-mono text-[11px] text-warning/80">{val}</span> },
    { key: 'duration', label: 'Duration', render: (val) => <span className="text-[11px] text-text-muted/55">{val}</span> },
  ];

  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45 mb-1">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[22px] font-black tracking-[-0.04em] text-text leading-none">
              {PAGE.title}
            </h2>
            <p className="text-[12px] text-text-muted/55 mt-1.5 leading-snug max-w-lg">
              {PAGE.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => exportRows(ws.filtered, 'trading-positions.csv')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {positionsConfig.kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        {/* ── Table Card ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title={positionsConfig.tableTitle}
            count={ws.table.items.length}
            accentColor={PAGE.accent}
            search={ws.search}
            onSearchChange={ws.setSearch}
            searchPlaceholder="Search positions…"
            filters={
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-positive/20 bg-positive/8 mr-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" />
                  <span className="text-[9.5px] font-black uppercase tracking-widest text-positive">Live</span>
                </div>
                {ws.filterSets.map((fs) => (
                  <div key={fs.label} className="flex items-center gap-1">
                    <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">{fs.label}:</span>
                    <select
                      value={fs.get}
                      onChange={(e) => fs.set(e.target.value)}
                      className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                      style={{ minWidth: '80px' }}
                    >
                      <option value="all">All</option>
                      {fs.opts.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </>
            }
          />

          <MainTable
            columns={columns}
            data={ws.table.items}
            onRowClick={(row) => drawerRowState.open(row)}
            emptyTitle="No positions match your filters."
            pagination={ws.table}
            rowClassName="hover:bg-positive/5 hover:border-l-positive"
          />
        </section>
      </div>

      {/* Drawer */}
      <TradingDrawer
        open={drawerRowState.isOpen}
        title={drawerRowState.value ? `Position ${drawerRowState.value.ticket}` : ''}
        subtitle={drawerRowState.value ? `${drawerRowState.value.symbol} · ${drawerRowState.value.side}` : ''}
        onClose={() => { drawerRowState.close(); setActionDone(null); }}
        actionDone={actionDone}
      >
        {drawerRowState.value && <PositionDetailsDrawer row={drawerRowState.value} onAction={handleAction} />}
      </TradingDrawer>
    </PageShell>
  );
}

export default PositionsPage;
