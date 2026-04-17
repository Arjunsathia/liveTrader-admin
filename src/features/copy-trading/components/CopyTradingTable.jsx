import React from 'react';
import { Activity, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable';
import { STATUS_COLORS, RISK_COLORS, SEVERITY_COLORS, COPY_LOG_COLORS } from '../../../utils/statusMaps';

/* ─── Chip primitives ──────────────────────────────────────── */
function ColorChip({ value, colorMap }) {
  const color = (colorMap ?? STATUS_COLORS)[value] || 'var(--text-muted)';
  return (
    <span
      className="inline-flex items-center rounded-[5px] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap"
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

function LogTypeLabel({ value }) {
  const color = COPY_LOG_COLORS[value] || 'var(--text-muted)';
  return (
    <span className="text-[10px] font-black uppercase tracking-[0.08em]" style={{ color }}>
      {value?.replace(/_/g, ' ')}
    </span>
  );
}

/* ─── Cell renderer map ─────────────────────────────────────── */
const renderers = {
  mono:      (val) => <span className="font-mono text-[11px] text-text-muted/70">{val || '—'}</span>,
  num:       (val) => <span className="font-mono text-[12px] font-semibold text-text">{val}</span>,
  name:      (val) => <span className="text-[12px] font-semibold text-text">{val}</span>,
  amount:    (val) => <span className="font-mono text-[12px] font-semibold text-brand">{val}</span>,
  tag:       (val) => <span className="rounded-[5px] border border-border/25 px-2 py-0.5 text-[10px] font-semibold text-text-muted">{val}</span>,
  detail:    (val) => <span className="text-[11px] text-text-muted/65 block truncate max-w-[240px]" title={val}>{val}</span>,
  dd:        (val) => <span className="font-mono text-[11px]" style={{ color: 'var(--negative)' }}>{val}</span>,
  status:    (val) => <ColorChip value={val} colorMap={STATUS_COLORS} />,
  approval:  (val) => <ColorChip value={val} colorMap={STATUS_COLORS} />,
  logstatus: (val) => <ColorChip value={val} colorMap={STATUS_COLORS} />,
  risk:      (val) => <ColorChip value={val} colorMap={RISK_COLORS} />,
  severity:  (val) => <ColorChip value={val} colorMap={SEVERITY_COLORS} />,
  logtype:   (val) => <LogTypeLabel value={val} />,
  pnl: (val) => {
    const pos = String(val).startsWith('+');
    const neg = String(val).startsWith('-');
    return (
      <span
        className="font-mono text-[12px] font-semibold"
        style={{ color: pos ? 'var(--positive)' : neg ? 'var(--negative)' : 'var(--text)' }}
      >
        {val}
      </span>
    );
  },
  user: (row) => (
    <div>
      <div className="text-[12px] font-medium text-text">{row.user ?? row.provider ?? row.follower}</div>
      <div className="font-mono text-[10px] text-text-muted/50">{row.uid}</div>
    </div>
  ),
  rating: (val) => (
    <span className="flex items-center gap-1">
      <Star size={11} style={{ color: 'var(--warning)', fill: 'var(--warning)' }} />
      <span className="font-mono text-[12px] font-semibold text-text">{val}</span>
    </span>
  ),
  trend: (val) => {
    const cfg = {
      UP:   { color: 'var(--positive)',   Icon: TrendingUp   },
      FLAT: { color: 'var(--text-muted)', Icon: Activity      },
      DOWN: { color: 'var(--negative)',   Icon: TrendingDown  },
    }[val] ?? { color: 'var(--text-muted)', Icon: Activity };
    return (
      <span className="flex items-center gap-1" style={{ color: cfg.color }}>
        <cfg.Icon size={13} />
        <span className="text-[10px] font-semibold">{val}</span>
      </span>
    );
  },
  sharpe: (val) => {
    const n = parseFloat(val);
    const color = n > 2 ? 'var(--positive)' : n > 1 ? 'var(--warning)' : 'var(--negative)';
    return <span className="font-mono text-[12px] font-semibold" style={{ color }}>{val}</span>;
  },
};

/**
 * CopyTradingTable — wraps DataTable with Copy Trading cell renderers.
 * Color maps imported from utils/statusMaps (single source of truth).
 */
export function CopyTradingTable({ columns: configCols, items, onRowClick, slug }) {
  const actionLabel = slug === 'subscriptions' ? 'Manage' : slug === 'logs' ? 'Inspect' : 'Open';

  const columns = [
    ...configCols.map((col) => ({
      ...col,
      render: (row) => {
        const val = row[col.key];
        const renderer = renderers[col.type];
        return renderer
          ? renderer(col.type === 'user' ? row : val)
          : <span className="text-[12px] text-text">{val || '—'}</span>;
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
          {actionLabel}
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
