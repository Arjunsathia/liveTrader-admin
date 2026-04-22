import React, { useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { KpiCard } from '../../../components/cards/KpiCard';
import { Badge } from '../../../components/ui/Badge';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { STATUS_COLOR, RISK_COLOR } from '../data/financeConstants';

/* ─── StatusChip ─────────────────────────────────────────────
   Thin forward to Badge with Finance colorMaps.
   Kept as a named export so FinanceScreen doesn't need changes.
─────────────────────────────────────────────────────────────── */
export function StatusChip({ value, colorMap = STATUS_COLOR }) {
  return <Badge colorMap={colorMap}>{value}</Badge>;
}

/* ─── KpiCard ────────────────────────────────────────────────
   Re-export the shared canonical KpiCard so FinanceScreen import
   `{ KpiCard }` from this file still works without change.
─────────────────────────────────────────────────────────────── */
export { KpiCard };

/* ─── FilterDropdown ─────────────────────────────────────────
   Uses shared useClickOutside hook instead of inline useEffect.
─────────────────────────────────────────────────────────────── */
export function FilterDropdown({ label, value, onChange, options, Icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = value !== 'all';

  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-[9px] border border-border/30 bg-bg/60 px-3 text-[10px] font-black uppercase tracking-[0.08em] text-text-muted transition-all hover:border-border/55 hover:text-text hover:bg-surface-elevated/70 shadow-sm"
      >
        {Icon && <Icon size={12} className="mr-0.5 opacity-60" />}
        {label}
        {active && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-[0.1em] text-primary">
            {value}
          </span>
        )}
        <ChevronDown
          size={11}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'} text-text-muted/40 ml-0.5`}
        />
      </button>
      {open && options.length > 0 && (
        <div
          className="absolute left-0 top-full z-50 mt-1.5 min-w-[180px] overflow-hidden rounded-[12px] border border-border/40 p-1 shadow-2xl shadow-black/60"
          style={{ background: 'var(--surface-2)' }}
        >
          <button
            onClick={() => { onChange('all'); setOpen(false); }}
            className={`flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-[12px] font-medium transition-all ${value === 'all' ? 'bg-primary/10 text-primary' : 'text-text/60 hover:bg-white/10 hover:text-text'}`}
          >
            All
          </button>
          <div className="my-1 h-px bg-border/20 mx-1" />
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              className={`flex w-full items-center justify-between gap-2 rounded-[8px] px-3 py-2 text-[12px] font-medium transition-all ${value === o ? 'bg-primary/10 text-primary font-bold' : 'text-text/80 hover:bg-white/10 hover:text-text'}`}
            >
              <span>{o}</span>
              {value === o && <Check size={12} strokeWidth={3} style={{ color: 'var(--brand)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SectionSwitcher ─────────────────────────────────────── */
export function SectionSwitcher({ slug, navigate }) {
  const isDeposit = slug === 'deposits';
  const isWithdrawal = slug === 'withdrawals';

  if (!isDeposit && !isWithdrawal) return null;

  return (
    <div
      className="flex items-center gap-1 rounded-[10px] border border-border/20 bg-bg/60 p-1 mb-4"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
    >
      {[
        { slug: 'deposits', label: 'Deposits', Icon: ArrowUpRight, accent: 'var(--brand)' },
        { slug: 'withdrawals', label: 'Withdrawals', Icon: ArrowDownRight, accent: 'var(--negative)' },
      ].map(({ slug: s, label, Icon, accent }) => {
        const active = slug === s;
        return (
          <button
            key={s}
            onClick={() => navigate(`/finance/${s}`)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[8px] py-2.5 px-5 text-[12px] font-semibold transition-all duration-300 ${active ? 'bg-surface-elevated border border-border/30 shadow-card-subtle opacity-100' : 'bg-transparent border border-transparent opacity-50 hover:opacity-80'}`}
            style={{ color: active ? accent : 'var(--text-muted)' }}
          >
            <Icon size={13} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* Re-export constants so FinanceScreen can import from here */
export { STATUS_COLOR, RISK_COLOR };
