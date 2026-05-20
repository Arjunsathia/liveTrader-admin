import React from 'react';
import { FeatureTable } from '../../../components/tables/FeatureTable';
import { ChevronRight } from 'lucide-react';

function latencyCell(value) {
  const ms = parseInt(value, 10) || 0;
  const color = ms > 500 ? 'var(--negative)' : ms > 200 ? 'var(--warning)' : 'var(--positive)';
  const bg = ms > 500 ? 'color-mix(in srgb, var(--negative) 10%, transparent)' : ms > 200 ? 'color-mix(in srgb, var(--warning) 10%, transparent)' : 'color-mix(in srgb, var(--positive) 8%, transparent)';
  return (
    <span
      className="inline-flex items-center rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-semibold"
      style={{ color, background: bg }}
    >
      {value}
    </span>
  );
}

function logTypeCell(value) {
  return (
    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-text-muted">
      {value}
    </span>
  );
}

const typeOverrides = {
  symbol: 'mono',
  result: 'status',
  logstatus: 'status',
  logtype: 'logtype',
  latency: 'latency',
};

const customRenderers = {
  latency: latencyCell,
  logtype: logTypeCell,
};

export function TradingTable({ columns: configCols, items, onRowClick }) {
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
      label: '',
      align: 'right',
      width: '48px',
      render: (_, row) => (
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); onRowClick?.(row); }}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border/20 bg-surface-elevated text-text-muted opacity-0 group-hover:opacity-100 hover:border-brand/35 hover:text-brand transition-all cursor-pointer"
          title="Open Details"
        >
          <ChevronRight size={13} strokeWidth={2} />
        </button>
      ),
    },
  ];

  return (
    <FeatureTable
      columns={columns}
      data={items}
      onRowClick={onRowClick}
      emptyMsg="No records found"
    />
  );
}
