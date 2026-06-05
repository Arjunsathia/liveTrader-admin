import React from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Clock } from 'lucide-react';

/**
 * WalletStatCards
 * Row of 3 stat chips: Total Deposits / Total Withdrawals / Pending
 */
export function WalletStatCards({ data }) {
  const totalDeposits    = data?.totalDeposits    ?? 142800.00;
  const totalWithdrawals = data?.totalWithdrawals ?? 58600.00;
  const pendingAmount    = data?.pendingAmount    ?? 11700.00;

  const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const stats = [
    {
      id: 'total-deposits',
      label: 'Total Deposits',
      value: fmt(totalDeposits),
      icon: ArrowDownToLine,
      color: 'var(--positive)',
      colorMix: 'color-mix(in srgb, var(--positive) 10%, transparent)',
      borderMix: 'color-mix(in srgb, var(--positive) 18%, transparent)',
      badge: 'All time',
    },
    {
      id: 'total-withdrawals',
      label: 'Total Withdrawals',
      value: fmt(totalWithdrawals),
      icon: ArrowUpFromLine,
      color: 'var(--negative)',
      colorMix: 'color-mix(in srgb, var(--negative) 10%, transparent)',
      borderMix: 'color-mix(in srgb, var(--negative) 18%, transparent)',
      badge: 'All time',
    },
    {
      id: 'pending-balance',
      label: 'Locked / Pending',
      value: fmt(pendingAmount),
      icon: Clock,
      color: 'var(--warning)',
      colorMix: 'color-mix(in srgb, var(--warning) 10%, transparent)',
      borderMix: 'color-mix(in srgb, var(--warning) 18%, transparent)',
      badge: 'Processing',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={s.id}
            className="rounded-[15px] p-5 flex items-center gap-4 transition-all duration-200 hover:scale-[1.01] animate-fade-up"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              animationDelay: `${i * 60}ms`,
            }}
          >
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
              style={{ background: s.colorMix, border: `1px solid ${s.borderMix}` }}
            >
              <Icon size={18} strokeWidth={1.8} style={{ color: s.color }} />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>
                  {s.label}
                </p>
                <span
                  className="px-1.5 py-0.5 rounded-[4px] text-[8.5px] font-black uppercase tracking-[0.1em] leading-none"
                  style={{ background: s.colorMix, color: s.color }}
                >
                  {s.badge}
                </span>
              </div>
              <p className="font-mono font-black text-[20px] tracking-[-0.03em] leading-tight" style={{ color: 'var(--text)' }}>
                {s.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
