import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

const MIN_AMOUNTS   = { bank: 50, crypto: 20, card: 50 };
const MAX_DAILY     = { bank: 50000, crypto: 100000, card: 10000 };
const FEE_FLAT      = { bank: 5,  crypto: 0,   card: 0   };
const FEE_PCT       = { bank: 0,  crypto: 0,   card: 0.015 };

const QUICK_AMOUNTS = ['100', '500', '1000', '2500'];

/**
 * WithdrawAmountForm
 * Amount input with min/max limits, live balance check, and fee preview.
 */
export function WithdrawAmountForm({ method, amount, onChange, availableBalance }) {
  const num       = parseFloat(amount) || 0;
  const min       = MIN_AMOUNTS[method]  ?? 50;
  const max       = Math.min(MAX_DAILY[method] ?? 50000, availableBalance);
  const flatFee   = FEE_FLAT[method]    ?? 0;
  const pctFee    = FEE_PCT[method]     ?? 0;
  const fee       = flatFee + num * pctFee;
  const receive   = Math.max(0, num - fee);

  const exceedsBalance = num > availableBalance;
  const belowMin       = num > 0 && num < min;
  const isValid        = num >= min && !exceedsBalance;

  const available = availableBalance ?? 10500;

  return (
    <div className="flex flex-col gap-5">
      {/* Available balance chip */}
      <div
        className="flex items-center justify-between p-3.5 rounded-[11px]"
        style={{ background: 'color-mix(in srgb, var(--positive) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--positive) 14%, transparent)' }}
      >
        <div>
          <p className="text-[9.5px] font-black uppercase tracking-[0.14em] mb-0.5" style={{ color: 'rgba(194,198,214,0.4)' }}>
            Available to Withdraw
          </p>
          <p className="font-mono font-black text-[20px] tracking-[-0.03em]" style={{ color: 'var(--positive)' }}>
            ${available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <button
          id="withdraw-use-max-btn"
          onClick={() => onChange(String(available))}
          className="px-3 py-1.5 rounded-[8px] text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-150 cursor-pointer hover:scale-[1.02]"
          style={{ background: 'color-mix(in srgb, var(--positive) 12%, transparent)', color: 'var(--positive)' }}
        >
          Use Max
        </button>
      </div>

      {/* Amount input */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
          Withdrawal Amount (USD)
        </label>
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-[22px]"
            style={{ color: 'rgba(194,198,214,0.35)' }}
          >
            $
          </span>
          <input
            id="withdraw-amount-input"
            type="number"
            value={amount}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            min={min}
            max={max}
            className="w-full pl-10 pr-5 rounded-[13px] font-mono font-black text-[24px] tracking-[-0.03em] outline-none transition-all duration-200"
            style={{
              height: '64px',
              background: 'var(--muted-surface)',
              border: `1.5px solid ${
                exceedsBalance ? 'color-mix(in srgb, var(--negative) 45%, transparent)' :
                belowMin ? 'color-mix(in srgb, var(--warning) 40%, transparent)' :
                'rgba(173,198,255,0.09)'
              }`,
              color: 'var(--text)',
              caretColor: 'var(--brand)',
            }}
          />
        </div>

        {/* Limit hints */}
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: 'rgba(194,198,214,0.4)' }}>
            Min: ${min.toLocaleString()} · Max: ${max.toLocaleString()}/day
          </span>
          {exceedsBalance && (
            <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: 'var(--negative)' }}>
              <AlertTriangle size={11} /> Exceeds available balance
            </span>
          )}
          {belowMin && !exceedsBalance && (
            <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: 'var(--warning)' }}>
              <AlertTriangle size={11} /> Below minimum
            </span>
          )}
        </div>
      </div>

      {/* Quick picks */}
      <div className="flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((v) => (
          <button
            key={v}
            id={`withdraw-quick-${v}`}
            onClick={() => onChange(v)}
            className="px-3.5 py-2 rounded-[9px] text-[12.5px] font-bold transition-all duration-150 cursor-pointer hover:scale-[1.03] active:scale-95"
            style={{
              background: amount === v
                ? 'color-mix(in srgb, var(--brand) 12%, transparent)'
                : 'var(--muted-surface)',
              border: `1px solid ${amount === v ? 'color-mix(in srgb, var(--brand) 30%, transparent)' : 'transparent'}`,
              color: amount === v ? 'var(--brand)' : 'rgba(194,198,214,0.55)',
            }}
          >
            ${v}
          </button>
        ))}
      </div>

      {/* Fee preview */}
      {num > 0 && (
        <div
          className="rounded-[12px] p-4 flex flex-col gap-2 animate-in fade-in duration-200"
          style={{ background: 'color-mix(in srgb, var(--brand) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--brand) 12%, transparent)' }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
            Fee Breakdown
          </p>
          {[
            { label: 'Withdrawal Amount', value: `$${num.toFixed(2)}`, color: 'var(--text)' },
            { label: `Processing Fee`,    value: fee > 0 ? `-$${fee.toFixed(2)}` : 'Free', color: fee > 0 ? 'var(--negative)' : 'var(--positive)' },
            { label: 'You Receive',       value: `$${receive.toFixed(2)}`, color: 'var(--positive)', bold: true },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[12px]" style={{ color: 'rgba(194,198,214,0.55)' }}>{row.label}</span>
              <span className={`font-mono text-[13px] ${row.bold ? 'font-black' : 'font-semibold'}`} style={{ color: row.color }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Info note */}
      <div
        className="flex items-start gap-2.5 p-3.5 rounded-[10px] text-[12px]"
        style={{ background: 'color-mix(in srgb, var(--warning) 6%, transparent)', color: 'rgba(194,198,214,0.6)' }}
      >
        <Info size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} strokeWidth={2} />
        Withdrawal requests are reviewed by our team. Processing times vary by method. Ensure your payment details are correct before submitting.
      </div>
    </div>
  );
}
