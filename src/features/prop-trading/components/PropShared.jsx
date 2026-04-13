import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export const STATUS_COLOR = {
  PUBLISHED: 'var(--positive)', DRAFT: 'var(--text-muted)', PAUSED: 'var(--warning)',
  APPROVED: 'var(--positive)', REJECTED: 'var(--negative)', PENDING: 'var(--warning)',
  REVIEW: 'var(--cyan)', ACTIVE: 'var(--positive)', BREACHED: 'var(--negative)',
  WARNED: 'var(--warning)', EXPIRED: 'var(--text-muted)', EXPIRING: 'var(--warning)',
  VERIFIED: 'var(--positive)', FAILED: 'var(--negative)',
};

export function Badge({ value, size = 'sm' }) {
  const color = STATUS_COLOR[value] || 'var(--text-muted)';
  const cls = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-[3px] text-[9.5px]';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading ${cls}`}
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
      {value}
    </span>
  );
}

export function RiskBadge({ value }) {
  const color = value === 'HIGH' ? 'var(--negative)' : value === 'MEDIUM' ? 'var(--warning)' : 'var(--positive)';
  return (
    <span className="inline-flex items-center rounded-[5px] px-1.5 py-[3px] text-[9.5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
      {value}
    </span>
  );
}

export function SectionHead({ title, Icon: Ic, action }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Ic && <Ic size={11} className="text-text-muted/35 flex-shrink-0" />}
      <span className="text-[9.5px] font-black uppercase tracking-[0.18em] text-text-muted/35 font-heading select-none">{title}</span>
      <div className="flex-1 h-px bg-white/[0.05]" />
      {action}
    </div>
  );
}

export function Card({ children, className = '', pad = true }) {
  return (
    <div className={`bg-surface-elevated border border-border/40 shadow-card-subtle rounded-[10px] relative overflow-hidden transition-all duration-300 ${pad ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function IconBtn({ Icon: Ic, label, variant = 'default', onClick, small }) {
  const vs = {
    danger: { border: '1px solid rgba(239,68,68,0.22)', bg: 'rgba(239,68,68,0.07)', color: '#ef4444' },
    success: { border: '1px solid rgba(74,225,118,0.22)', bg: 'rgba(74,225,118,0.07)', color: 'var(--positive)' },
    warning: { border: '1px solid rgba(217,119,6,0.22)', bg: 'rgba(217,119,6,0.07)', color: '#d97706' },
    cyan: { border: '1px solid rgba(6,182,212,0.22)', bg: 'rgba(6,182,212,0.07)', color: 'var(--cyan)' },
    brand: { border: '1px solid rgba(var(--brand-rgb),0.22)', bg: 'rgba(var(--brand-rgb),0.08)', color: 'var(--brand)' },
    default: { border: '1px solid rgba(255,255,255,0.08)', bg: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' },
  };
  const s = vs[variant] ?? vs.default;
  const h = small ? 'h-7 px-2.5 text-[10.5px]' : 'h-8 px-3 text-[11px]';
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 ${h} rounded-[7px] font-semibold font-heading transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer whitespace-nowrap`}
      style={{ border: s.border, background: s.bg, color: s.color }}>
      {Ic && <Ic size={small ? 11 : 12} />}{label}
    </button>
  );
}

export function FormField({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/40 font-heading">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-text-muted/30 font-heading">{hint}</p>}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, mono, type = 'text', className = '' }) {
  return (
    <input type={type} value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
      className={`w-full h-9 px-3 rounded-[9px] border border-white/[0.07] bg-white/[0.025] text-[13px] text-text outline-none placeholder:text-text-muted/25 focus:border-primary/30 transition-colors ${mono ? 'font-mono' : 'font-heading'} ${className}`}
    />
  );
}

export function SelectInput({ value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange?.(e.target.value)}
        className="w-full h-9 px-3 pr-8 rounded-[9px] border border-white/[0.07] bg-white/[0.025] text-[13px] text-text outline-none font-heading appearance-none cursor-pointer focus:border-primary/30 transition-colors">
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
    </div>
  );
}

export function Toggle({ val, onChange, label, hint }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.04] last:border-0">
      <div>
        <div className="text-[12.5px] font-semibold text-text/75 font-heading">{label}</div>
        {hint && <div className="text-[10.5px] text-text-muted/35 font-heading mt-0.5">{hint}</div>}
      </div>
      <button onClick={() => onChange(!val)}
        className={`relative w-10 h-5 rounded-full border flex-shrink-0 mt-0.5 transition-all duration-300 cursor-pointer
          ${val ? 'bg-positive/[0.15] border-positive/30' : 'bg-white/[0.03] border-white/[0.08]'}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${val ? 'translate-x-5 bg-positive' : 'translate-x-0.5 bg-text-muted/40'}`} />
      </button>
    </div>
  );
}

export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-white/[0.1] bg-[var(--surface-elevated,#1a1a1a)] shadow-xl px-3 py-2.5 text-[11px] font-mono">
      <div className="text-[9px] font-black uppercase tracking-widest text-text-muted/50 mb-1.5 font-heading">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-text-muted/60 capitalize">{String(p.dataKey).replace('_', ' ')}</span>
          <span className="font-semibold ml-1" style={{ color: p.color }}>
            {p.dataKey === 'payouts' ? `$${(p.value / 1000).toFixed(0)}K` : p.value}
            {(p.dataKey === 'pass' || p.dataKey === 'fail') ? '%' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
