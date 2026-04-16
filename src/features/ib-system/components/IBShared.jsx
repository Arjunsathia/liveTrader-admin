import React, { useState } from 'react';
import { Check, Copy, Star } from 'lucide-react';
import { STATUS_CLR, TIER_CLR } from '../configs/shared.config';

/* ─── Badge ──────────────────────────────────────────────────── */
export function IBBadge({ value, size = 'sm' }) {
  const color = STATUS_CLR[value] || 'var(--text-muted)';
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

/* ─── TierBadge ──────────────────────────────────────────────── */
export function IBTierBadge({ value }) {
  const color = TIER_CLR[value] || 'rgba(255,255,255,0.4)';
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[5px] px-2 py-[3px] text-[9.5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}
    >
      <Star size={8} className="flex-shrink-0" /> {value}
    </span>
  );
}

/* ─── RiskBadge ──────────────────────────────────────────────── */
export function IBRiskBadge({ value }) {
  const color = value === 'HIGH' ? 'var(--negative)' : value === 'MEDIUM' ? 'var(--warning)' : 'var(--positive)';
  return (
    <span
      className="inline-flex items-center rounded-[5px] px-1.5 py-[3px] text-[9.5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}
    >
      {value}
    </span>
  );
}

/* ─── SectionHead ────────────────────────────────────────────── */
export function SectionHead({ title, Icon: Ic, action }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Ic && <Ic size={11} className="text-text-muted/50 flex-shrink-0" />}
      <span className="text-[9.5px] font-black uppercase tracking-[0.18em] text-text-muted/50 font-heading select-none">{title}</span>
      <div className="flex-1 h-px bg-border/30" />
      {action}
    </div>
  );
}

/* ─── IBCard ─────────────────────────────────────────────────── */
export function IBCard({ children, className = '', pad = true }) {
  return (
    <div className={`rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle ${pad ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

/* ─── TraderAvatar ───────────────────────────────────────────── */
export function TraderAvatar({ name }) {
  const initials = (name || '?').replace('unknown-', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-6 h-6 rounded-[5px] bg-primary/[0.1] border border-primary/[0.18] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
      {initials}
    </div>
  );
}

/* ─── Toast ──────────────────────────────────────────────────── */
import { CheckCircle2 } from 'lucide-react';
export function IBToast({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading animate-in fade-in duration-200">
      <CheckCircle2 size={13} />{msg}
    </div>
  );
}

/* ─── IconBtn ────────────────────────────────────────────────── */
export function IBIconBtn({ Icon: Ic, label, variant = 'default', onClick, small }) {
  const vs = {
    danger:  { border: '1px solid rgba(239,68,68,0.22)',  bg: 'rgba(239,68,68,0.07)',  color: '#ef4444'           },
    success: { border: '1px solid rgba(74,225,118,0.22)', bg: 'rgba(74,225,118,0.07)', color: 'var(--positive)'   },
    warning: { border: '1px solid rgba(217,119,6,0.22)',  bg: 'rgba(217,119,6,0.07)',  color: '#d97706'           },
    cyan:    { border: '1px solid rgba(6,182,212,0.22)',  bg: 'rgba(6,182,212,0.07)',  color: 'var(--cyan)'       },
    brand:   { border: '1px solid rgba(218,165,32,0.25)', bg: 'rgba(218,165,32,0.09)', color: 'var(--brand)'      },
    default: { border: '1px solid var(--border)',         bg: 'var(--bg)',              color: 'var(--text-muted)' },
  };
  const s = vs[variant] ?? vs.default;
  const h = small ? 'h-7 px-2.5 text-[10.5px]' : 'h-8 px-3 text-[11px]';
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 ${h} rounded-[7px] font-semibold font-heading transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer whitespace-nowrap`}
      style={{ border: s.border, background: s.bg, color: s.color }}
    >
      {Ic && <Ic size={small ? 11 : 12} />}{label}
    </button>
  );
}

/* ─── DrawerField (DF) ───────────────────────────────────────── */
export function IBDrawerField({ label, value, mono, accent, wide, copyable }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`group relative rounded-[9px] border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 ${wide ? 'col-span-2' : ''}`}>
      <div className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/35 mb-1 font-heading">{label}</div>
      <div className={`text-[12.5px] truncate ${mono ? 'font-mono' : 'font-semibold font-heading'}`} style={{ color: accent ?? 'var(--text)' }}>{value ?? '—'}</div>
      {copyable && value && (
        <button
          onClick={() => { navigator.clipboard.writeText(String(value)); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted/30 hover:text-text-muted cursor-pointer"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
      )}
    </div>
  );
}

export function IBDrawerGrid({ children }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

/* ─── Chart tooltip ──────────────────────────────────────────── */
export function IBChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const fmt = (k, v) => (k === 'approved' || k === 'pending') ? `$${(v / 1000).toFixed(0)}K` : v?.toLocaleString?.() ?? v;
  return (
    <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-lg px-3 py-2.5 text-[11px] font-mono">
      <div className="text-[9px] font-black uppercase tracking-widest text-text-muted/50 mb-1.5 font-heading">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-text-muted/60 capitalize">{String(p.dataKey).replace(/_/g, ' ')}</span>
          <span className="font-semibold ml-1" style={{ color: p.color }}>{fmt(p.dataKey, p.value)}</span>
        </div>
      ))}
    </div>
  );
}
