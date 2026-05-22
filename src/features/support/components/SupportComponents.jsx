/**
 * SupportComponents.jsx
 * Shared atoms, constants, and micro-components for the Support feature.
 *
 * All generic primitives re-export from canonical component layer.
 * Only Support-specific components that are not in the global design system live here.
 */

/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from 'react';
import { Check, CheckCircle2, X } from 'lucide-react';
import { PRIORITY_COLORS, CATEGORY_COLORS, STATUS_COLORS } from '@config/constants/status.constants';

/* ── Color maps (re-exported for backward compat) ────────────── */

export const PRIORITY_CLR = PRIORITY_COLORS;

export const PRIORITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export const STATUS_CLR = {
  OPEN:      STATUS_COLORS.OPEN,
  PENDING:   STATUS_COLORS.PENDING,
  ESCALATED: STATUS_COLORS.ESCALATED,
  RESOLVED:  STATUS_COLORS.RESOLVED,
  CLOSED:    STATUS_COLORS.CLOSED,
};

export const CAT_CLR = CATEGORY_COLORS;

export const KYC_CLR   = { VERIFIED: 'var(--positive)', PENDING: 'var(--warning)', REVIEW: 'var(--warning)', FAILED: 'var(--negative)' };
export const WALL_CLR  = { ACTIVE: 'var(--positive)',   INACTIVE: 'var(--text-muted)',  FROZEN: 'var(--negative)' };
export const TRADE_CLR = { ACTIVE: 'var(--positive)',   NONE:     'var(--text-muted)',  SUSPENDED: 'var(--negative)' };

/* ── Canonical re-exports ─────────────────────────────────────── */
export { ActionBtn as SupportIconBtn } from '../../../components/ui';
export { ActionBtn as IconBtn } from '../../../components/ui';

/* ── Support-specific: PriorityBadge ─────────────────────────── */
export function PriorityBadge({ value, size = 'sm' }) {
  const color  = PRIORITY_COLORS[value] || 'var(--text-muted)';
  const cls    = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-[3px] text-[9.5px]';
  const dotSz  = size === 'lg' ? 'w-1.5 h-1.5' : 'w-1 h-1';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading ${cls}`}
      style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 25%, transparent)` }}
    >
      <span className={`${dotSz} rounded-full flex-shrink-0 ${value === 'CRITICAL' ? 'animate-pulse' : ''}`} style={{ background: color }} />
      {value}
    </span>
  );
}

/* ── Support-specific: SupportStatusBadge ────────────────────── */
export function SupportStatusBadge({ value, size = 'sm' }) {
  const color = STATUS_COLORS[value] || 'var(--text-muted)';
  const cls   = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-[3px] text-[9.5px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading ${cls}`}
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}
    >
      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
      {value}
    </span>
  );
}

/* ── Support-specific: CatTag ────────────────────────────────── */
export function CatTag({ value }) {
  const color = CATEGORY_COLORS[value] || 'rgba(255,255,255,0.35)';
  return (
    <span
      className="inline-flex items-center rounded-[5px] px-1.5 py-[2px] text-[9px] font-bold uppercase tracking-[0.09em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 18%, transparent)` }}
    >
      {value}
    </span>
  );
}

/* ── Support-specific: SlaBar ────────────────────────────────── */
export function SlaBar({ pct, slaMins }) {
  const isBreached = pct === 0 || (slaMins != null && slaMins < 0);
  const isWarning  = pct < 30 && !isBreached;
  const color      = isBreached ? 'var(--negative)' : isWarning ? 'var(--warning)' : 'var(--positive)';
  const displayPct = Math.max(0, Math.min(100, pct));

  const fmt = (m) => {
    if (m == null)   return 'Resolved';
    if (m < 0)       return `${Math.abs(m)}m breached`;
    if (m < 60)      return `${m}m left`;
    return `${Math.floor(m / 60)}h ${m % 60}m left`;
  };

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full bg-border/20 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${displayPct}%`, background: color }}
        />
      </div>
      <span
        className="text-[10px] font-mono flex-shrink-0"
        style={{ color: isBreached ? 'var(--negative)' : isWarning ? 'var(--warning)' : 'var(--text-muted)' }}
      >
        {fmt(slaMins)}
      </span>
    </div>
  );
}

/* ── Support-specific: UserAvatar ────────────────────────────── */
export function UserAvatar({ name, size = 'sm' }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const dim =
    size === 'lg' ? 'w-10 h-10 text-[12px] rounded-[10px]' :
    size === 'md' ? 'w-8 h-8 text-[10px] rounded-[8px]' :
                    'w-6 h-6 text-[9px] rounded-[6px]';
  return (
    <div className={`${dim} bg-primary/[0.1] border border-primary/[0.18] flex items-center justify-center font-bold text-primary font-heading flex-shrink-0`}>
      {initials}
    </div>
  );
}

/* ── Support-specific: SupportStatCard ──────────────────────── */
export function SupportStatCard({ label, val, color, urgent = false }) {
  return (
    <div className={`rounded-[10px] border px-4 py-3 ${urgent ? 'border-negative/25 bg-negative/[0.04]' : 'border-border/30 bg-surface-elevated shadow-card-subtle'}`}>
      <div className="text-[9.5px] font-black uppercase tracking-[0.14em] font-heading mb-1.5"
        style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
        {label}
      </div>
      <div className="text-[17px] font-bold font-heading tracking-[-0.02em]" style={{ color }}>
        {val}
      </div>
    </div>
  );
}

/* ── Support-specific: SupportSectionHead ────────────────────── */
export function SupportSectionHead({ title, Icon: Ic, action }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Ic && <Ic size={11} className="text-text-muted/35 flex-shrink-0" />}
      <span className="text-[9.5px] font-black uppercase tracking-[0.18em] text-text-muted/35 font-heading select-none">{title}</span>
      <div className="flex-1 h-px bg-border/20" />
      {action}
    </div>
  );
}

/* ── Support-specific: SupportToast ──────────────────────────── */
export function SupportToast({ msg, onDone }) {
  useEffect(() => {
    if (msg) {
      const t = setTimeout(onDone, 3000);
      return () => clearTimeout(t);
    }
  }, [msg, onDone]);

  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading animate-in fade-in duration-200">
      <CheckCircle2 size={13} />{msg}
    </div>
  );
}

/* ── Support-specific: SlaCheckRow ──────────────────────────── */
export function SlaCheckRow({ label, sla, met }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-text-muted/40 font-heading">
        {label}: <span className="text-text-muted/55">{sla}</span>
      </span>
      <span className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-positive/[0.12]' : 'bg-negative/[0.12]'}`}>
        {met ? <Check size={9} className="text-positive" /> : <X size={9} className="text-negative" />}
      </span>
    </div>
  );
}
