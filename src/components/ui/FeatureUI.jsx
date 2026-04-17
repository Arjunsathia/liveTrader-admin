import React from 'react';
import { STATUS_COLORS, RISK_COLORS } from '../../utils/statusMaps';

/* ─── StatusChip ───────────────────────────────────────────────
   Canonical colored badge used across ALL features.

   Replaces:
   - Badge / RiskBadge in PropTradingShared.jsx
   - IBBadge / IBRiskBadge in IBSystemShared.jsx
   - StatusChip in TradingTable.jsx
   - ColorChip in CopyTradingTable.jsx

   Props:
   - value     string  — status text displayed
   - colorMap  object  — optional custom color map (defaults to STATUS_COLORS)
   - size      'sm'|'lg'
   - dot       boolean — show dot prefix (default true)
───────────────────────────────────────────────────────────────── */
export function StatusChip({ value, colorMap, size = 'sm', dot = true }) {
  const map = colorMap ?? STATUS_COLORS;
  const color = map[value] || 'var(--text-muted)';
  const cls = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-[3px] text-[9.5px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading ${cls}`}
      style={{
        color,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      {dot && <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />}
      {value}
    </span>
  );
}

/** Convenience — renders with RISK_COLORS map */
export function RiskChip({ value }) {
  return <StatusChip value={value} colorMap={RISK_COLORS} dot={false} />;
}

/* ─── SectionHead ──────────────────────────────────────────────
   Canonical section divider used across ALL features.

   Replaces:
   - SectionHead in PropTradingShared.jsx
   - SectionHead in IBSystemShared.jsx

   Props:
   - title   string
   - Icon    Lucide icon component (optional)
   - action  ReactNode — right-side slot (optional)
───────────────────────────────────────────────────────────────── */
export function SectionHead({ title, Icon: Ic, action }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Ic && <Ic size={11} className="text-text-muted/45 flex-shrink-0" />}
      <span className="text-[9.5px] font-black uppercase tracking-[0.18em] text-text-muted/45 font-heading select-none">
        {title}
      </span>
      <div className="flex-1 h-px bg-border/25" />
      {action}
    </div>
  );
}

/* ─── ActionBtn ────────────────────────────────────────────────
   Canonical icon+label action button for drawer actions and
   quick-action panels.

   Replaces:
   - IconBtn in PropTradingShared.jsx
   - IBIconBtn in IBSystemShared.jsx

   Props:
   - label   string
   - Icon    Lucide icon component
   - variant 'success'|'danger'|'warning'|'cyan'|'brand'|'default'
   - onClick () => void
   - small   boolean (compact size)
───────────────────────────────────────────────────────────────── */
const ACTION_BTN_VARIANTS = {
  danger:  { border: '1px solid rgba(239,68,68,0.22)',   bg: 'rgba(239,68,68,0.07)',   color: '#ef4444'         },
  success: { border: '1px solid rgba(74,225,118,0.22)',  bg: 'rgba(74,225,118,0.07)',  color: 'var(--positive)' },
  warning: { border: '1px solid rgba(217,119,6,0.22)',   bg: 'rgba(217,119,6,0.07)',   color: '#d97706'         },
  cyan:    { border: '1px solid rgba(6,182,212,0.22)',   bg: 'rgba(6,182,212,0.07)',   color: 'var(--cyan)'     },
  brand:   { border: '1px solid rgba(218,165,32,0.25)',  bg: 'rgba(218,165,32,0.09)',  color: 'var(--brand)'    },
  default: { border: '1px solid rgba(255,255,255,0.08)', bg: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)'},
};

export function ActionBtn({ Icon: Ic, label, variant = 'default', onClick, small = false }) {
  const s = ACTION_BTN_VARIANTS[variant] ?? ACTION_BTN_VARIANTS.default;
  const h = small ? 'h-7 px-2.5 text-[10.5px]' : 'h-8 px-3 text-[11px]';
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 ${h} rounded-[7px] font-semibold font-heading transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer whitespace-nowrap`}
      style={{ border: s.border, background: s.bg, color: s.color }}
    >
      {Ic && <Ic size={small ? 11 : 12} />}
      {label}
    </button>
  );
}

/* ─── ActionToast ──────────────────────────────────────────────
   Canonical success feedback toast shown after drawer/quick actions.

   Replaces:
   - IBToast in IBSystemShared.jsx
   - Inline {toast && <div>...} blocks in all Prop Trading pages

   Props:
   - msg   string | null  — message to show; null/undefined hides it
───────────────────────────────────────────────────────────────── */
import { CheckCircle2 } from 'lucide-react';

export function ActionToast({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading animate-in fade-in duration-200">
      <CheckCircle2 size={13} />
      {msg}
    </div>
  );
}

/* ─── TableActionBtn ──────────────────────────────────────────
   Canonical compact icon-only button for table row hover actions (.group).

   Props:
   - Icon    Lucide icon component
   - onClick () => void
   - variant 'success'|'danger'|'warning'|'default'
───────────────────────────────────────────────────────────────── */
export function TableActionBtn({ Icon: Ic, onClick, variant = 'default' }) {
  const s = {
    success: 'border-positive/20 bg-positive/[0.07] text-positive',
    danger:  'border-negative/20 bg-negative/[0.07] text-negative',
    warning: 'border-warning/20 bg-warning/[0.07] text-warning/60 hover:text-warning',
    default: 'border-border/30 text-text-muted/40 hover:text-text',
  }[variant] || 'border-border/30 text-text-muted/40';

  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 rounded-[5px] border flex items-center justify-center cursor-pointer transition-all hover:brightness-110 active:scale-90 ${s}`}
    >
      <Ic size={10} />
    </button>
  );
}
