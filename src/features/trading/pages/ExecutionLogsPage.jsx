import React, { useState } from 'react';
import { Download, RefreshCw, Search } from 'lucide-react';
import { PageShell } from '../../../components/layout/PageShell';
import { KpiCard } from '../../../components/cards';
import { Pagination } from '../../../components/tables/Pagination';
import { ExecutionLogDrawer } from '../components/ExecutionLogDrawer';
import { useWorkspace } from '@hooks/useWorkspace';
import { logsConfig } from '../data/workspaces/logs.workspace';
import { exportRows } from '../../../utils/exporters';

const PAGE = {
  accent: 'var(--warning)',
  eyebrow: 'Trading Operations',
  title: 'Execution Logs',
  description: 'MT5 bridge events — executions, rejections, latency alerts, and margin calls.',
};

const SEVERITY_META = {
  INFO:     { color: 'var(--positive)', bg: 'color-mix(in srgb, var(--positive) 10%, transparent)', border: 'color-mix(in srgb, var(--positive) 22%, transparent)' },
  WARN:     { color: 'var(--warning)',  bg: 'color-mix(in srgb, var(--warning) 10%, transparent)',  border: 'color-mix(in srgb, var(--warning) 22%, transparent)' },
  ERROR:    { color: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 10%, transparent)', border: 'color-mix(in srgb, var(--negative) 22%, transparent)' },
  CRITICAL: { color: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 14%, transparent)', border: 'color-mix(in srgb, var(--negative) 30%, transparent)' },
};

function latencyBadge(value) {
  const ms = parseInt(value, 10) || 0;
  const color = ms > 500 ? 'var(--negative)' : ms > 200 ? 'var(--warning)' : 'var(--positive)';
  const bg = ms > 500
    ? 'color-mix(in srgb, var(--negative) 10%, transparent)'
    : ms > 200
    ? 'color-mix(in srgb, var(--warning) 10%, transparent)'
    : 'color-mix(in srgb, var(--positive) 8%, transparent)';
  return (
    <span
      className="inline-flex items-center rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-black"
      style={{ color, background: bg }}
    >
      {value}
    </span>
  );
}

export function ExecutionLogsPage() {
  const ws = useWorkspace(logsConfig);
  const [drawerRow, setDrawerRow] = useState(null);

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
              onClick={() => exportRows(ws.filtered, 'trading-execution-logs.csv')}
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
          {logsConfig.kpis.map((k) => (
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
                {logsConfig.tableTitle}
              </h3>
              <span
                className="px-1.5 py-0.5 rounded-[5px] text-[10px] font-black border"
                style={{ color: PAGE.accent, background: `color-mix(in srgb, ${PAGE.accent} 10%, transparent)`, borderColor: `color-mix(in srgb, ${PAGE.accent} 22%, transparent)` }}
              >
                {ws.table.items.length}
              </span>
              {/* Error indicator */}
              {ws.filtered.filter(r => r.severity === 'ERROR' || r.severity === 'CRITICAL').length > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-negative/20 bg-negative/8">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-negative" />
                  <span className="text-[9.5px] font-black uppercase tracking-widest text-negative">
                    {ws.filtered.filter(r => r.severity === 'ERROR' || r.severity === 'CRITICAL').length} Errors
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
                <input
                  type="text"
                  value={ws.search}
                  onChange={(e) => ws.setSearch(e.target.value)}
                  placeholder="Search logs…"
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
                  <th className="px-4 py-3">Event ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Bridge</th>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Latency</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/8">
                {ws.table.items.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-10 text-center text-[12px] text-text-muted/40 italic">No events match your filters.</td></tr>
                ) : ws.table.items.map((row) => {
                  const sev = SEVERITY_META[row.severity] ?? SEVERITY_META.INFO;
                  const isCritical = row.severity === 'CRITICAL' || row.severity === 'ERROR';
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setDrawerRow(row)}
                      className={`group cursor-pointer transition-colors border-l-2 border-transparent ${
                        isCritical
                          ? 'hover:bg-negative/5 hover:border-l-negative'
                          : row.severity === 'WARN'
                          ? 'hover:bg-warning/5 hover:border-l-warning'
                          : 'hover:bg-positive/5 hover:border-l-positive'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-[11px] font-bold text-brand">{row.eventId}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/70">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold border border-border/25 rounded-[4px] px-1.5 py-0.5 text-text-muted font-mono">
                          {row.bridge}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-text-muted/70">{row.symbol}</td>
                      <td className="px-4 py-3">{latencyBadge(row.latency)}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-text-muted/55">{row.code}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-[10px] font-black"
                          style={{ color: sev.color, background: sev.bg, border: `1px solid ${sev.border}` }}
                        >
                          {row.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-text-muted/55">{row.timestamp}</td>
                      <td className="px-4 py-3 max-w-[220px]">
                        <span className="block truncate text-[11px] text-text-muted/65" title={row.detail}>
                          {row.detail}
                        </span>
                      </td>
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
      <ExecutionLogDrawer
        open={!!drawerRow}
        row={drawerRow}
        onClose={() => setDrawerRow(null)}
      />
    </PageShell>
  );
}

export default ExecutionLogsPage;
