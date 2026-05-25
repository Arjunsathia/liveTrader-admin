import React from 'react';
import { Activity, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { MainTable } from '../../../components/common/table';
import { COPY_LOG_COLORS } from '@/config/constants/status.constants';

function logTypeCell(value) {
  const color = COPY_LOG_COLORS[value] || 'var(--text-muted)';
  return (
    <span className="text-[10px] font-black uppercase tracking-[0.08em]" style={{ color }}>
      {value?.replace(/_/g, ' ')}
    </span>
  );
}

function ratingCell(value) {
  return (
    <span className="flex items-center gap-1">
      <Star size={11} style={{ color: 'var(--warning)', fill: 'var(--warning)' }} />
      <span className="font-mono text-[12px] font-semibold text-text">{value}</span>
    </span>
  );
}

function trendCell(value) {
  const cfg = {
    UP: { color: 'var(--positive)', Icon: TrendingUp },
    FLAT: { color: 'var(--text-muted)', Icon: Activity },
    DOWN: { color: 'var(--negative)', Icon: TrendingDown },
  }[value] ?? { color: 'var(--text-muted)', Icon: Activity };

  return (
    <span className="flex items-center gap-1" style={{ color: cfg.color }}>
      <cfg.Icon size={13} />
      <span className="text-[10px] font-semibold">{value}</span>
    </span>
  );
}

function sharpeCell(value) {
  const n = parseFloat(value);
  const color = n > 2 ? 'var(--positive)' : n > 1 ? 'var(--warning)' : 'var(--negative)';
  return <span className="font-mono text-[12px] font-semibold" style={{ color }}>{value}</span>;
}

const typeOverrides = {
  num: 'num',
  dd: 'pnl',
  approval: 'status',
  logstatus: 'status',
  logtype: 'logtype',
  rating: 'rating',
  trend: 'trend',
  sharpe: 'sharpe',
};

const customRenderers = {
  logtype: logTypeCell,
  rating: ratingCell,
  trend: trendCell,
  sharpe: sharpeCell,
};

export function CopyTradingTable({ columns: configCols, items, onRowClick, slug, pagination }) {
  const actionLabel = slug === 'subscriptions' ? 'Manage' : slug === 'logs' ? 'Inspect' : 'Open';
  const columns = [
    ...configCols.map((column) => {
      const type = typeOverrides[column.type] ?? column.type ?? 'text';
      return {
        ...column,
        type,
        render: customRenderers[type] ? (value) => customRenderers[type](value) : column.render,
      };
    }),
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); onRowClick?.(row); }}
          className="h-7 rounded-[6px] border border-border/25 bg-bg px-2.5 text-[11px] font-semibold text-text-muted transition-all hover:border-border/60 hover:text-text cursor-pointer"
        >
          {actionLabel}
        </button>
      ),
    },
  ];

  return (
    <MainTable
      columns={columns}
      data={items}
      onRowClick={onRowClick}
      emptyTitle="No records found"
      pagination={pagination}
      rowClassName={() => "hover:bg-cyan/5 hover:border-l-cyan cursor-pointer"}
    />
  );
}
