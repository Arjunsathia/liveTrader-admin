import React, { useState } from 'react';
import { Activity, Layers, TrendingUp, ShieldAlert, Clock, BarChart2, Download, RefreshCw, Search } from 'lucide-react';
import { PageShell } from '../../../components/layout/PageShell';
import { KpiCard } from '../../../components/cards';
import { Pagination } from '../../../components/tables/Pagination';
import { TradingDrawer } from '../components/TradingDrawer';
import { PositionDetailsDrawer } from '../components/TradingDetailPanels';
import { useWorkspace } from '@hooks/useWorkspace';
import { positionsConfig } from '../data/workspaces/positions.workspace';
import { exportRows } from '../../../utils/exporters';

const PAGE = {
  accent: 'var(--positive)',
  eyebrow: 'Trading Operations',
  title: 'Live Positions',
  description: 'Real-time floating positions across all MT5 accounts — exposure, P&L, and margin.',
};

export function PositionsPage() {
  const ws = useWorkspace(positionsConfig);
  const [drawerRow, setDrawerRow] = useState(null);
  const [actionDone, setActionDone] = useState(null);

  const handleAction = (label) => setActionDone(label);

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

          {/* Table Header */}
          <div className="px-5 py-3.5 border-b border-border/12 flex items-center justify-between gap-3 bg-surface-elevated flex-wrap">
            <div className="flex items-center gap-2.5">
              <div
                className="w-1 h-5 rounded-full"
                style={{ background: PAGE.accent }}
              />
              <h3 className="font-black text-[12px] tracking-widest uppercase text-text/80">
                {positionsConfig.tableTitle}
              </h3>
              <span className="px-1.5 py-0.5 rounded-[5px] bg-positive/10 text-positive text-[10px] font-black border border-positive/20">
                {ws.table.items.length}
              </span>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-positive/20 bg-positive/8">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" />
                <span className="text-[9.5px] font-black uppercase tracking-widest text-positive">Live</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
                <input
                  type="text"
                  value={ws.search}
                  onChange={(e) => ws.setSearch(e.target.value)}
                  placeholder="Search positions…"
                  className="h-7 pl-7 pr-3 w-36 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/35 outline-none focus:border-brand/40 focus:w-48 transition-all"
                />
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
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9.5px] uppercase font-black text-text-muted/50 tracking-[0.12em] border-b border-border/10 bg-bg/20">
                  <th className="px-4 py-3">Ticket</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Side</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Open</th>
                  <th className="px-4 py-3">Current</th>
                  <th className="px-4 py-3">Float P&L</th>
                  <th className="px-4 py-3">Swap</th>
                  <th className="px-4 py-3">Margin</th>
                  <th className="px-4 py-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/8">
                {ws.table.items.length === 0 ? (
                  <tr><td colSpan={11} className="px-5 py-10 text-center text-[12px] text-text-muted/40 italic">No positions match your filters.</td></tr>
                ) : ws.table.items.map((row) => {
                  const isBuy = row.side === 'BUY';
                  const sideColor = isBuy ? 'var(--positive)' : 'var(--negative)';
                  const pnlPositive = String(row.pnl).startsWith('+');
                  const pnlColor = pnlPositive ? 'var(--positive)' : 'var(--negative)';
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setDrawerRow(row)}
                      className="group cursor-pointer hover:bg-positive/5 transition-colors border-l-2 border-transparent hover:border-l-positive"
                    >
                      <td className="px-4 py-3 font-mono text-[11px] font-bold text-brand">{row.ticket}</td>
                      <td className="px-4 py-3">
                        <div className="text-[12px] font-semibold text-text">{row.user}</div>
                        <div className="text-[9.5px] font-mono text-text-muted/45">{row.uid}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] font-semibold text-text">{row.symbol}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] font-black"
                          style={{ color: sideColor, background: `color-mix(in srgb, ${sideColor} 10%, transparent)` }}
                        >
                          {isBuy ? '▲' : '▼'} {row.side}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-text-muted/75">{row.size}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-text-muted/75">{row.openPrice}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-text">{row.currPrice}</td>
                      <td className="px-4 py-3">
                        <span
                          className="font-mono text-[13px] font-black"
                          style={{ color: pnlColor, textShadow: `0 0 12px color-mix(in srgb, ${pnlColor} 40%, transparent)` }}
                        >
                          {row.pnl}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-text-muted/55">{row.swap}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-warning/80">{row.margin}</td>
                      <td className="px-4 py-3 text-[11px] text-text-muted/55">{row.duration}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-border/10">
            <Pagination
              page={ws.table.page}
              totalPages={ws.table.totalPages}
              onPageChange={ws.table.setPage}
              pageSize={ws.table.pageSize}
              onPageSizeChange={ws.table.setPageSize}
            />
          </div>
        </section>
      </div>

      {/* Drawer */}
      <TradingDrawer
        open={!!drawerRow}
        title={drawerRow ? `Position ${drawerRow.ticket}` : ''}
        subtitle={drawerRow ? `${drawerRow.symbol} · ${drawerRow.side}` : ''}
        onClose={() => { setDrawerRow(null); setActionDone(null); }}
        actionDone={actionDone}
      >
        {drawerRow && <PositionDetailsDrawer row={drawerRow} onAction={handleAction} />}
      </TradingDrawer>
    </PageShell>
  );
}

export default PositionsPage;
