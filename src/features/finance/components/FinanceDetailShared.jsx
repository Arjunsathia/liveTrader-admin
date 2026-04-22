import React, { useRef, useState } from 'react';
import {
  Check, CheckCircle2, Copy, ChevronDown, Info, AlertTriangle, XCircle,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { STATUS_COLOR, RISK_COLOR, SCAN_COLOR } from '../data/financeConstants';

/* ─── StatusChip ───────────────────────────────────────────── */
/**
 * Thin wrapper — uses the shared Badge with a colorMap.
 * Replaces both `StatusChip` (FinanceShared) and `Chip` (FinanceDetailScreen).
 */
export function FinanceChip({ value, colorMap = STATUS_COLOR }) {
  return (
    <Badge colorMap={colorMap}>
      {value}
    </Badge>
  );
}

/* ─── Field ────────────────────────────────────────────────── */
export function Field({ label, value, mono = false, accent, copyable = false, wide = false }) {
  const [copied, setCopied] = useState(false);

  function doCopy() {
    navigator.clipboard.writeText(String(value)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={`rounded-[9px] border border-border/25 bg-surface p-3 transition-colors hover:border-border/50 ${wide ? 'col-span-2' : ''}`}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50 mb-1.5">
        {label}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-[12.5px] leading-snug break-all flex-1 ${mono ? 'font-mono' : 'font-semibold'}`}
          style={{ color: accent ?? 'var(--text)' }}
        >
          {value || '—'}
        </span>
        {copyable && value && value !== '—' && (
          <button
            onClick={doCopy}
            className="flex-shrink-0 rounded-[4px] p-1 text-text-muted/40 hover:text-text transition-colors"
          >
            {copied ? <Check size={11} className="text-positive" /> : <Copy size={11} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── SectionLabel ─────────────────────────────────────────── */
export function SectionLabel({ title, Icon }) {
  return (
    <div className="flex items-center gap-2 pt-1 mb-3">
      {Icon && <Icon size={12} className="text-text-muted/40 flex-shrink-0" />}
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted/45">
        {title}
      </span>
      <div className="flex-1 h-px bg-border/15" />
    </div>
  );
}

/* ─── ActionBtn ────────────────────────────────────────────── */
export function ActionBtn({ label, Icon, color, bg, border, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-[8px] border px-3.5 py-2.5 text-[12px] font-semibold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
      style={{ color, background: bg, borderColor: border }}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

/* ─── ScanBadge ────────────────────────────────────────────── */
export function ScanBadge({ label, value }) {
  const cfg = SCAN_COLOR[value] ?? { c: 'var(--text-muted)' };
  const IconMap = { PASSED: CheckCircle2, CLEAR: CheckCircle2, REVIEW: AlertTriangle, FAIL: XCircle };
  const Ic = IconMap[value] ?? Info;

  return (
    <div className="flex items-center justify-between gap-2 rounded-[8px] border border-border/15 bg-bg/40 px-3 py-2">
      <span className="text-[11px] text-text-muted/60">{label}</span>
      <div className="flex items-center gap-1.5">
        <Ic size={12} style={{ color: cfg.c }} />
        <span className="text-[11px] font-semibold" style={{ color: cfg.c }}>{value}</span>
      </div>
    </div>
  );
}

/* ─── MoreMenu ─────────────────────────────────────────────── */
export function MoreMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 items-center gap-1.5 rounded-[7px] border border-border/25 bg-bg/60 px-2.5 text-[11px] font-semibold text-text-muted hover:border-border/50 hover:text-text transition-all"
      >
        More <ChevronDown size={11} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 w-[200px] rounded-[12px] border border-border/40 py-1 shadow-2xl"
          style={{ background: 'var(--surface-2)' }}
        >
          {items.map(({ label, Icon, danger, fn }) => (
            <button
              key={label}
              onClick={() => { fn?.(); setOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-[12px] transition-colors hover:bg-surface-elevated text-left"
              style={{ color: danger ? 'var(--negative)' : 'var(--text)' }}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Re-export color maps for consumers */
export { STATUS_COLOR, RISK_COLOR, SCAN_COLOR };
