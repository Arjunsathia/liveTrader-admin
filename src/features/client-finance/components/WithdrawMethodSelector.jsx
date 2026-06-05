import React from 'react';
import { CreditCard, Bitcoin, Building2, Zap, Clock } from 'lucide-react';

const WITHDRAW_METHODS = [
  {
    id: 'bank',
    label: 'Bank Transfer',
    sub: 'SWIFT, SEPA, Wire',
    icon: Building2,
    color: 'cyan',
    processingLabel: '1–3 Business Days',
    processingIcon: Clock,
    fee: '$5 flat',
  },
  {
    id: 'crypto',
    label: 'Cryptocurrency',
    sub: 'USDT, BTC, ETH',
    icon: Bitcoin,
    color: 'warning',
    processingLabel: '10–30 Minutes',
    processingIcon: Zap,
    fee: '0%',
  },
  {
    id: 'card',
    label: 'Card Refund',
    sub: 'Original card only',
    icon: CreditCard,
    color: 'brand',
    processingLabel: '3–5 Business Days',
    processingIcon: Clock,
    fee: '1.5%',
  },
];

/**
 * WithdrawMethodSelector
 * Radio-card method tiles for selecting withdrawal destination type.
 */
export function WithdrawMethodSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {WITHDRAW_METHODS.map((m) => {
        const Icon        = m.icon;
        const ProcIcon    = m.processingIcon;
        const isSelected  = value === m.id;
        const cssColor    = `var(--${m.color})`;
        const cssBg       = `color-mix(in srgb, var(--${m.color}) 8%, transparent)`;
        const csBorder    = `color-mix(in srgb, var(--${m.color}) 25%, transparent)`;
        const cssMuted    = `color-mix(in srgb, var(--${m.color}) 12%, transparent)`;

        return (
          <button
            key={m.id}
            id={`withdraw-method-${m.id}`}
            onClick={() => onChange(m.id)}
            className="w-full flex items-center gap-4 p-4 rounded-[13px] transition-all duration-200 cursor-pointer outline-none text-left hover:scale-[1.005]"
            style={{
              background: isSelected ? cssBg : 'var(--muted-surface)',
              border: `1px solid ${isSelected ? csBorder : 'transparent'}`,
              boxShadow: isSelected ? `0 0 0 1px ${csBorder}` : 'none',
            }}
          >
            <div
              className="w-11 h-11 rounded-[11px] flex items-center justify-center shrink-0"
              style={{ background: cssMuted, color: cssColor }}
            >
              <Icon size={20} strokeWidth={1.8} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>{m.label}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: 'rgba(194,198,214,0.5)' }}>{m.sub}</p>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className="text-[10.5px] font-bold px-2 py-0.5 rounded-[5px]"
                  style={{ background: cssMuted, color: cssColor }}
                >
                  Fee: {m.fee}
                </span>
                <span className="flex items-center gap-1 text-[10.5px]" style={{ color: 'rgba(194,198,214,0.45)' }}>
                  <ProcIcon size={10} strokeWidth={2.2} />
                  {m.processingLabel}
                </span>
              </div>
            </div>

            <div
              className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200"
              style={{ borderColor: isSelected ? cssColor : 'rgba(194,198,214,0.2)' }}
            >
              {isSelected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: cssColor }} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export { WITHDRAW_METHODS };
