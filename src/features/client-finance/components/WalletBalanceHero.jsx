import React from 'react';
import { TrendingUp, TrendingDown, Lock, Shield, Eye, EyeOff } from 'lucide-react';

/**
 * WalletBalanceHero
 * Full-width gradient hero card showing main / available / locked balance.
 */
export function WalletBalanceHero({ data, onDeposit, onWithdraw }) {
  const [hidden, setHidden] = React.useState(false);

  const totalBalance    = data?.totalBalance    ?? 84200.00;
  const availableBalance = data?.availableBalance ?? 72500.00;
  const lockedBalance   = data?.lockedBalance   ?? 11700.00;
  const todayChange     = data?.todayChange     ?? 405.00;
  const todayChangePct  = data?.todayChangePct  ?? 1.68;
  const isPositive      = todayChange >= 0;

  const fmt = (n) =>
    hidden ? '••••••' : `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div
      className="relative rounded-[20px] p-7 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand) 18%, var(--surface)) 0%, var(--surface) 60%, color-mix(in srgb, var(--cyan) 5%, var(--surface)) 100%)',
        border: '1px solid color-mix(in srgb, var(--brand) 22%, transparent)',
        boxShadow: '0 0 60px -12px color-mix(in srgb, var(--brand) 15%, transparent), 0 4px 24px rgba(0,0,0,0.35)',
      }}
    >
      {/* Background glow orb */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--brand) 12%, transparent) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--cyan) 8%, transparent) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Balance info */}
        <div className="flex flex-col gap-4">
          {/* Label + hide toggle */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px]"
              style={{ background: 'color-mix(in srgb, var(--brand) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--brand) 20%, transparent)' }}
            >
              <Shield size={10} style={{ color: 'var(--brand)' }} strokeWidth={2.5} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--brand)' }}>
                Verified Wallet
              </span>
            </div>
            <button
              onClick={() => setHidden(!hidden)}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors duration-150 cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              {hidden ? <Eye size={11} /> : <EyeOff size={11} />}
              {hidden ? 'Show' : 'Hide'}
            </button>
          </div>

          {/* Total balance */}
          <div>
            <p className="text-[10.5px] font-black uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--text-muted)' }}>
              Total Balance
            </p>
            <p
              className="font-mono font-black tracking-[-0.04em] leading-none"
              style={{ fontSize: '38px', color: 'var(--text)' }}
            >
              {fmt(totalBalance)}
            </p>
            {/* Today change */}
            <div className="flex items-center gap-1.5 mt-2.5">
              {isPositive
                ? <TrendingUp size={13} style={{ color: 'var(--positive)' }} strokeWidth={2.2} />
                : <TrendingDown size={13} style={{ color: 'var(--negative)' }} strokeWidth={2.2} />
              }
              <span
                className="text-[12.5px] font-bold font-mono"
                style={{ color: isPositive ? 'var(--positive)' : 'var(--negative)' }}
              >
                {isPositive ? '+' : ''}{fmt(todayChange)} ({isPositive ? '+' : ''}{todayChangePct}%)
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>today</span>
            </div>
          </div>

          {/* Available / Locked split */}
          <div className="flex flex-wrap gap-4 pt-1">
            <div className="flex flex-col gap-0.5">
              <p className="text-[9.5px] font-black uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
                Available
              </p>
              <p className="font-mono font-bold text-[17px] tracking-[-0.03em]" style={{ color: 'var(--positive)' }}>
                {fmt(availableBalance)}
              </p>
            </div>

            <div className="w-px self-stretch" style={{ background: 'var(--border)' }} />

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <Lock size={9} style={{ color: 'var(--warning)' }} strokeWidth={2.5} />
                <p className="text-[9.5px] font-black uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
                  Locked / Pending
                </p>
              </div>
              <p className="font-mono font-bold text-[17px] tracking-[-0.03em]" style={{ color: 'var(--warning)' }}>
                {fmt(lockedBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex sm:flex-col gap-3 shrink-0">
          <button
            id="wallet-hero-deposit-btn"
            onClick={onDeposit}
            className="flex items-center justify-center gap-2 h-11 px-6 rounded-[12px] font-bold text-[13.5px] tracking-[-0.01em] transition-all duration-200 cursor-pointer active:scale-95 hover:scale-[1.02]"
            style={{ background: 'var(--brand)', color: 'var(--text-on-accent)', boxShadow: '0 4px 14px color-mix(in srgb, var(--brand) 40%, transparent)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M3 7l4 4 4-4M1 11h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Deposit
          </button>
          <button
            id="wallet-hero-withdraw-btn"
            onClick={onWithdraw}
            className="flex items-center justify-center gap-2 h-11 px-6 rounded-[12px] font-bold text-[13.5px] tracking-[-0.01em] transition-all duration-200 cursor-pointer active:scale-95 hover:scale-[1.02]"
            style={{
              background: 'color-mix(in srgb, var(--muted-surface) 80%, transparent)',
              border: '1px solid color-mix(in srgb, var(--border) 60%, transparent)',
              color: 'var(--text)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 13V5M3 7L7 3l4 4M1 11h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
