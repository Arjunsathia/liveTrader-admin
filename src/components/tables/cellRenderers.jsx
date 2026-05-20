import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { CatChip, PriorityChip, RiskChip, StatusChip } from '../ui/StatusChip';
import { SEVERITY_COLORS } from '@config/constants/status.constants';

const EMPTY = <span className="text-text-muted/30">-</span>;

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function textValue(value, className = 'text-[12px] text-text/75') {
  return hasValue(value) ? <span className={className}>{value}</span> : EMPTY;
}

export const tableCellRenderers = {
  text: (value) => textValue(value),
  mono: (value) => textValue(value, 'font-mono text-[11px] text-text-muted/70'),
  amount: (value) => textValue(value, 'font-mono text-[12px] font-semibold text-brand'),
  num: (value) => textValue(value, 'font-mono text-[12px] font-semibold text-text'),
  tag: (value) => hasValue(value)
    ? <span className="rounded-[5px] border border-border/25 px-2 py-0.5 text-[10px] font-semibold text-text-muted">{value}</span>
    : EMPTY,
  detail: (value) => hasValue(value)
    ? <span className="block max-w-[280px] truncate text-[11px] text-text-muted/70" title={String(value)}>{value}</span>
    : EMPTY,
  status: (value) => hasValue(value) ? <StatusChip value={value} /> : EMPTY,
  result: (value) => hasValue(value) ? <StatusChip value={value} /> : EMPTY,
  approval: (value) => hasValue(value) ? <StatusChip value={value} /> : EMPTY,
  risk: (value) => hasValue(value) ? <RiskChip value={value} /> : EMPTY,
  priority: (value) => hasValue(value) ? <PriorityChip value={value} /> : EMPTY,
  category: (value) => hasValue(value) ? <CatChip value={value} /> : EMPTY,
  severity: (value) => hasValue(value) ? <StatusChip value={value} colorMap={SEVERITY_COLORS} dot={false} /> : EMPTY,
  pnl: (value) => {
    if (!hasValue(value)) return EMPTY;
    const stringValue = String(value);
    const positive = stringValue.startsWith('+');
    const negative = stringValue.startsWith('-');
    return (
      <span
        className="font-mono text-[12px] font-semibold"
        style={{ color: positive ? 'var(--positive)' : negative ? 'var(--negative)' : 'var(--text)' }}
      >
        {value}
      </span>
    );
  },
  side: (value) => {
    if (!hasValue(value)) return EMPTY;
    const isBuy = value === 'BUY';
    const color = isBuy ? 'var(--positive)' : 'var(--negative)';
    const Icon = isBuy ? ArrowUpRight : ArrowDownRight;
    return (
      <span
        className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] font-black"
        style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}
      >
        <Icon size={9} />
        {value}
      </span>
    );
  },
  user: (value, row) => {
    const user = value && typeof value === 'object' ? value : row;
    const name = user?.name ?? user?.user ?? user?.provider ?? user?.follower ?? value;
    const uid = user?.uid;
    if (!hasValue(name)) return EMPTY;
    return (
      <div className="min-w-0">
        <div className="truncate text-[12px] font-semibold text-text">{name}</div>
        {uid && <div className="font-mono text-[10px] text-text-muted/50">{uid}</div>}
      </div>
    );
  },
};

export function renderTableCell(column, row, index) {
  const value = row?.[column.key];

  if (column.render) {
    return column.render(value, row, index);
  }

  const renderer = tableCellRenderers[column.type] ?? tableCellRenderers.text;
  return renderer(value, row, index, column);
}
