import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { PageShell } from '../../../components/layout/PageShell';
import { KpiCard } from '../../../components/cards';
import { MainTable, TableToolbar } from '../../../components/common/table';
import { ExecutionLogDrawer } from '../components/ExecutionLogDrawer';
import { useWorkspace } from '@/hooks/useWorkspace';
import { logsConfig } from '@/config/constants/copy-trading/workspaces/logs.workspace';
import { exportRows } from '../../../utils/exporters';
import { useDrawerState } from '@/hooks/useDrawerState';

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

function ExecutionLogsPage() {
  const ws = useWorkspace(logsConfig);
  const drawerRowState = useDrawerState(null);

  const columns = [
    { key: 'eventId', label: 'Event ID', render: (val) => <span className="font-mono text-[11px] font-bold text-brand">{val}</span> },
    { key: 'type', label: 'Type', render: (val) => <span className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/70">{val}</span> },
    { key: 'bridge', label: 'Bridge', render: (val) => <span className="text-[10px] font-bold border border-border/25 rounded-[4px] px-1.5 py-0.5 text-text-muted font-mono">{val}</span> },
    { key: 'symbol', label: 'Symbol', render: (val) => <span className="font-mono text-[12px] text-text-muted/70">{val}</span> },
    { key: 'latency', label: 'Latency', render: (val) => latencyBadge(val) },
    { key: 'code', label: 'Code', render: (val) => <span className="font-mono text-[11px] text-text-muted/55">{val}</span> },
    {
      key: 'severity',
      label: 'Severity',
      render: (val) => {
        const sev = SEVERITY_META[val] ?? SEVERITY_META.INFO;
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-[10px] font-black"
            style={{ color: sev.color, background: sev.bg, border: `1px solid ${sev.border}` }}
          >
            {val}
          </span>
        );
      },
    },
    { key: 'timestamp', label: 'Timestamp', render: (val) => <span className="font-mono text-[11px] text-text-muted/55">{val}</span> },
    { key: 'detail', label: 'Detail', render: (val) => <span className="block truncate max-w-[220px] text-[11px] text-text-muted/65" title={val}>{val}</span> },
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
          <TableToolbar
            title={logsConfig.tableTitle}
            count={ws.table.items.length}
            accentColor={PAGE.accent}
            search={ws.search}
            onSearchChange={ws.setSearch}
            searchPlaceholder="Search logs…"
            filters={
              <>
                {ws.filtered.filter(r => r.severity === 'ERROR' || r.severity === 'CRITICAL').length > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-negative/20 bg-negative/8 mr-2">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-negative" />
                    <span className="text-[9.5px] font-black uppercase tracking-widest text-negative">
                      {ws.filtered.filter(r => r.severity === 'ERROR' || r.severity === 'CRITICAL').length} Errors
                    </span>
                  </div>
                )}
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
            emptyTitle="No events match your filters."
            pagination={ws.table}
            rowClassName={(row) => {
              const isCritical = row.severity === 'CRITICAL' || row.severity === 'ERROR';
              if (isCritical) return 'hover:bg-negative/5 hover:border-l-negative';
              if (row.severity === 'WARN') return 'hover:bg-warning/5 hover:border-l-warning';
              return 'hover:bg-positive/5 hover:border-l-positive';
            }}
          />
        </section>
      </div>

      {/* Drawer */}
      <ExecutionLogDrawer
        open={drawerRowState.isOpen}
        row={drawerRowState.value}
        onClose={() => drawerRowState.close()}
      />
    </PageShell>
  );
}

export default ExecutionLogsPage;
