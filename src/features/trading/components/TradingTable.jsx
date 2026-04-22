import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable';
import { STATUS_COLORS, SEVERITY_COLORS, TRADING_LOG_COLORS } from '@config/constants/status.constants';

/* ─── StatusChip (Trading-local) ──────────────────────────── */
function StatusChip({ value }) {
  const color = STATUS_COLORS[value] || 'var(--text-muted)';
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[5px] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap"
      style={{
        color,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      {value}
    </span>
  );
}

function SeverityChip({ value }) {
  const color = SEVERITY_COLORS[value] || 'var(--text-muted)';
  return (
    <span
      className="rounded-[5px] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em]"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}
    >
      {value}
    </span>
  );
}

function LogTypeChip({ value }) {
  const color = TRADING_LOG_COLORS[value] || 'var(--text-muted)';
  return (
    <span className="text-[10px] font-black uppercase tracking-[0.1em]" style={{ color }}>
      {value}
    </span>
  );
}

/* ─── Cell renderer map ─────────────────────────────────────── */
const renderers = {
  mono:     (val) => <span className="font-mono text-[11px] text-text-muted/70">{val || '—'}</span>,
  amount:   (val) => <span className="font-mono text-[12px] font-semibold text-brand">{val}</span>,
  symbol:   (val) => <span className="font-mono text-[12px] font-semibold text-text">{val || '—'}</span>,
  tag:      (val) => <span className="rounded-[5px] border border-border/25 px-2 py-0.5 text-[10px] font-semibold text-text-muted">{val}</span>,
  detail:   (val) => <span className="text-[11px] text-text-muted/70 truncate block max-w-[280px]" title={val}>{val}</span>,
  status:   (val) => <StatusChip value={val} />,
  result:   (val) => <StatusChip value={val} />,
  logtype:  (val) => <LogTypeChip value={val} />,
  severity: (val) => <SeverityChip value={val} />,
  pnl: (val) => {
    const pos = String(val).startsWith('+');
    return <span className="font-mono text-[12px] font-semibold" style={{ color: pos ? 'var(--positive)' : 'var(--negative)' }}>{val}</span>;
  },
  side: (val) => {
    const isBuy = val === 'BUY';
    return (
      <span
        className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] font-black"
        style={{
          color: isBuy ? 'var(--positive)' : 'var(--negative)',
          background: isBuy ? 'color-mix(in srgb, var(--positive) 10%, transparent)' : 'color-mix(in srgb, var(--negative) 10%, transparent)',
        }}
      >
        {isBuy ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
        {val}
      </span>
    );
  },
  latency: (val) => {
    const ms = parseInt(val) || 0;
    const c = ms > 500 ? 'var(--negative)' : ms > 200 ? 'var(--warning)' : 'var(--positive)';
    return <span className="font-mono text-[11px] font-semibold" style={{ color: c }}>{val}</span>;
  },
  user: (row) => (
    <div>
      <div className="text-[12px] font-medium text-text">{row.user}</div>
      <div className="font-mono text-[10px] text-text-muted/50">{row.uid}</div>
    </div>
  ),
};

/**
 * TradingTable — wraps DataTable with Trading-specific cell renderers.
 * Color maps are centralized in config/constants/status.constants.
 */
export function TradingTable({ columns: configCols, items, onRowClick }) {
  const columns = [
    ...configCols.map((col) => ({
      ...col,
      render: (row) => {
        const val = row[col.key];
        const renderer = renderers[col.type];
        return renderer ? renderer(col.type === 'user' ? row : val) : val;
      },
    })),
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); onRowClick && onRowClick(row); }}
          className="h-7 rounded-[6px] border border-border/25 bg-bg px-2.5 text-[11px] font-semibold text-text-muted hover:border-border/60 hover:text-text transition-all"
        >
          Open
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      onRowClick={onRowClick}
      emptyTitle="No records found"
      emptyDescription="Try adjusting the filters or search query."
    />
  );
}
