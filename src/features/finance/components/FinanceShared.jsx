/**
 * finance/components/FinanceShared.jsx
 * Shared UI atoms: StatusBadge, RiskBadge, PriorityBadge, MethodBadge,
 * AmountCell, KpiCard, SectionHead, Card, IconBtn, Pagination, Toast, SummaryPills.
 */
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { PRIORITY_CLR, METHOD_ICONS } from '../data/financeMockData';

// Re-export canonical components to standardize styling
export { StatusChip as StatusBadge, RiskChip as RiskBadge, SectionHead, Card, ActionBtn as IconBtn } from '../../../components/ui';
export { KpiCard } from '../../../components/cards/KpiCard';

function PriorityBadge({ value }) {
  const color = PRIORITY_CLR[value] || 'var(--text-muted)';
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[5px] px-2 py-[3px] text-[9.5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}>
      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${value === 'CRITICAL' ? 'animate-pulse' : ''}`} style={{ background: color }} />
      {value}
    </span>
  );
}

function MethodBadge({ value }) {
  const Icon = METHOD_ICONS[value] || (() => null);
  return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-heading font-semibold text-text-muted/55">
      <Icon size={11} className="flex-shrink-0 text-text-muted/35" />
      {value}
    </span>
  );
}

function AmountCell({ value, type }) {
  const isCredit = value?.startsWith('+') || type === 'DEPOSIT' || type === 'COMMISSION' || type === 'REVERSAL' || type === 'ADJUSTMENT';
  const isDebit  = value?.startsWith('-') || type === 'WITHDRAWAL' || type === 'FEE';
  const color    = isCredit ? 'var(--positive)' : isDebit ? 'var(--negative)' : 'var(--text)';
  return <span className="font-mono font-bold text-[12.5px]" style={{ color }}>{value}</span>;
}

function Pagination({ total, page, perPage, setPage }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.04]">
      <span className="text-[11px] text-text-muted/35 font-heading">
        Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}
      </span>
      <div className="flex gap-1">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="w-7 h-7 rounded-[6px] border border-border/20 bg-bg flex items-center justify-center text-text-muted/40 hover:text-text hover:border-border/40 disabled:opacity-30 cursor-pointer transition-all">
          <ChevronDown size={12} className="rotate-90" />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)}
            className={`w-7 h-7 rounded-[6px] border text-[11px] font-bold font-heading cursor-pointer transition-all
              ${page === p ? 'bg-primary/[0.12] text-primary border-primary/25' : 'border-border/20 bg-bg text-text-muted/40 hover:text-text hover:border-border/40'}`}>
            {p}
          </button>
        ))}
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          className="w-7 h-7 rounded-[6px] border border-border/20 bg-bg flex items-center justify-center text-text-muted/40 hover:text-text hover:border-border/40 disabled:opacity-30 cursor-pointer transition-all">
          <ChevronDown size={12} className="-rotate-90" />
        </button>
      </div>
    </div>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => { if (msg) { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); } }, [msg]);
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading animate-in fade-in">
      <CheckCircle2 size={13} />{msg}
    </div>
  );
}

function SummaryPills({ items }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {items.map(p => (
        <div key={p.label} className="flex items-center gap-2 rounded-[8px] border border-border/20 bg-surface-bright/10 px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-[11px] text-text-muted/60 font-heading">{p.label}</span>
          <span className="text-[11px] font-mono font-bold" style={{ color: p.color }}>{p.val}</span>
        </div>
      ))}
    </div>
  );
}

export {
  PriorityBadge, MethodBadge, AmountCell,
  Pagination, Toast, SummaryPills,
};

