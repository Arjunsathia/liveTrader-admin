import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Ban, ChevronDown, Key, Lock } from 'lucide-react';

/* Labeled field tile */
export function Field({ label, value, mono = false, accent, wide = false, className = '' }) {
  return (
    <div
      className={`rounded-[10px] border border-border/40 bg-surface-elevated px-3 py-2.5 ${wide ? 'col-span-2' : ''} ${className}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.13em] text-text-muted/50 mb-1">
        {label}
      </div>
      <div
        className={`text-[13px] leading-snug ${mono ? 'font-mono' : 'font-medium'}`}
        style={{ color: accent ?? 'var(--text)' }}
      >
        {value || '—'}
      </div>
    </div>
  );
}

/* Section divider with label */
export function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted/40">
        {children}
      </span>
      <div className="flex-1 h-px bg-border/20" />
    </div>
  );
}

/* Stat pill */
export function StatPill({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5 rounded-[8px] border border-border/40 bg-surface-elevated px-2.5 py-1.5">
      <span
        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      <span className="text-[10px] font-medium text-text-muted/60">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-text">{value}</span>
    </div>
  );
}

/* Inline action button */
export function ActionBtn({ label, Icon, onClick, variant = 'default', disabled = false }) {
  const styles = {
    default: { border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-muted)' },
    primary: { border: '1px solid var(--brand)', background: 'rgba(255,193,7,0.1)', color: 'var(--brand)' },
    danger: { border: '1px solid #ef444440', background: '#ef44440d', color: '#ef4444' },
    success: { border: '1px solid #4ae17640', background: '#4ae1760d', color: '#4ae176' },
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 items-center gap-1.5 rounded-[8px] px-3 border-border/40 text-[11px] font-semibold transition-all hover:brightness-110 disabled:opacity-40"
      style={styles}
    >
      {Icon && <Icon size={12} />}
      {label}
    </button>
  );
}

/* KPI card */
export function KpiCard({ label, value, sub, dir, accent, Icon }) {
  return (
    <div
      className="relative flex flex-col gap-1.5 overflow-hidden rounded-[10px] border border-border/40 bg-surface-elevated p-3.5"
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-[10px]"
        style={{ background: `linear-gradient(90deg,${accent}cc,transparent)` }}
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-text-muted/50">
          {label}
        </span>
        <span
          className="flex h-6 w-6 items-center justify-center rounded-[6px]"
          style={{ background: `${accent}1a` }}
        >
          <Icon size={12} style={{ color: accent }} />
        </span>
      </div>
      <div
        className="font-mono text-[19px] font-semibold tracking-tight leading-none"
        style={{ color: accent }}
      >
        {value}
      </div>
      {sub && (
        <div className="flex items-center gap-1">
          {dir === 'up' && <ArrowUpRight size={10} style={{ color: '#4ae176' }} />}
          {dir === 'down' && <ArrowDownRight size={10} style={{ color: '#ef4444' }} />}
          <span className="text-[11px] font-medium text-text-muted/55">{sub}</span>
        </div>
      )}
    </div>
  );
}

/* More-actions dropdown */
export function MoreActionsMenu({ onSuspend, onReset, onFreeze, suspended }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const items = [
    { label: 'Reset Password', Icon: Key, fn: onReset, danger: false },
    { label: 'Freeze Wallet', Icon: Lock, fn: onFreeze, danger: false },
    { label: suspended ? 'Unsuspend Account' : 'Suspend Account', Icon: Ban, fn: onSuspend, danger: true },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 items-center gap-1.5 rounded-[8px] border border-border/40 bg-surface-elevated px-2.5 text-[11px] font-semibold text-text-muted hover:border-border/60 hover:text-text transition-all"
      >
        More <ChevronDown size={11} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 w-[185px] rounded-[10px] border border-border/40 py-1 shadow-2xl"
          style={{ background: 'var(--surface-elevated)' }}
        >
          {items.map(({ label, Icon, fn, danger }) => (
            <button
              key={label}
              onClick={() => { fn?.(); setOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-surface-1"
              style={{ color: danger ? '#ef4444' : 'var(--text)' }}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
