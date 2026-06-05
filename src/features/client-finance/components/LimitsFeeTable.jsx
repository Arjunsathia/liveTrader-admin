import React from 'react';
import { Info, Clock } from 'lucide-react';

const LIMITS_DATA = [
  {
    method: 'Credit / Debit Card',
    minDeposit:  '$10',
    maxDeposit:  '$10,000 / day',
    depositFee:  '2.5%',
    minWithdraw: '$50',
    maxWithdraw: '$10,000 / day',
    withdrawFee: '1.5%',
    processing:  'Instant',
    processingColor: 'var(--positive)',
  },
  {
    method: 'Bank Transfer',
    minDeposit:  '$50',
    maxDeposit:  '$50,000 / day',
    depositFee:  'Free',
    minWithdraw: '$50',
    maxWithdraw: '$50,000 / day',
    withdrawFee: '$5 flat',
    processing:  '1–3 Business Days',
    processingColor: 'var(--warning)',
  },
  {
    method: 'Crypto (USDT)',
    minDeposit:  '$20',
    maxDeposit:  'Unlimited',
    depositFee:  '0%',
    minWithdraw: '$20',
    maxWithdraw: '$100,000 / day',
    withdrawFee: '0%',
    processing:  '10–30 Minutes',
    processingColor: 'var(--cyan)',
  },
  {
    method: 'Crypto (BTC/ETH)',
    minDeposit:  '$50',
    maxDeposit:  'Unlimited',
    depositFee:  '0%',
    minWithdraw: '$50',
    maxWithdraw: '$100,000 / day',
    withdrawFee: '0%',
    processing:  '10–60 Minutes',
    processingColor: 'var(--cyan)',
  },
];

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar',         flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro',              flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound',     flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen',      flag: '🇯🇵' },
  { code: 'AED', name: 'UAE Dirham',        flag: '🇦🇪' },
  { code: 'INR', name: 'Indian Rupee',      flag: '🇮🇳' },
  { code: 'USDT', name: 'Tether (USDT)',    flag: '💵' },
  { code: 'BTC', name: 'Bitcoin',           flag: '₿' },
  { code: 'ETH', name: 'Ethereum',          flag: 'Ξ' },
  { code: 'BNB', name: 'BNB',              flag: '💛' },
];

/**
 * LimitsFeeTable
 * Displays deposit/withdrawal limits, fees, and processing times per method.
 */
export function LimitsFeeTable() {
  const cols = [
    { key: 'method',       label: 'Method',          align: 'left'  },
    { key: 'minDeposit',   label: 'Min Deposit',     align: 'right' },
    { key: 'maxDeposit',   label: 'Max Deposit',     align: 'right' },
    { key: 'depositFee',   label: 'Deposit Fee',     align: 'right' },
    { key: 'minWithdraw',  label: 'Min Withdraw',    align: 'right' },
    { key: 'maxWithdraw',  label: 'Max Withdraw',    align: 'right' },
    { key: 'withdrawFee',  label: 'Withdraw Fee',    align: 'right' },
    { key: 'processing',   label: 'Processing Time', align: 'right' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Info alert */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-[12px] text-[12.5px] bg-brand/8 border border-brand/20 text-text-muted">
        <Info size={14} className="shrink-0 mt-0.5 text-brand" strokeWidth={2.5} />
        <span>
          Limits may vary based on your <strong className="text-text font-bold">KYC verification level</strong>. Complete full verification to unlock higher limits. Fees are subject to change with 7-day notice.
        </span>
      </div>

      {/* Table */}
      <div className="bg-surface-elevated border border-border/40 shadow-card-subtle rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border/40">
                {cols.map((c) => (
                  <th
                    key={c.key}
                    className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] whitespace-nowrap bg-muted-surface/40 text-text-muted/60"
                    style={{
                      textAlign: c.align,
                    }}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {LIMITS_DATA.map((row) => (
                <tr
                  key={row.method}
                  className="transition-colors duration-150 hover:bg-brand/5"
                >
                  {cols.map((c) => (
                    <td
                      key={c.key}
                      className="px-4 py-4 whitespace-nowrap align-middle"
                      style={{ textAlign: c.align }}
                    >
                      {c.key === 'method' ? (
                        <span className="font-bold text-[13.5px] text-text">
                          {row[c.key]}
                        </span>
                      ) : c.key === 'processing' ? (
                        <span
                          className="inline-flex items-center gap-1.5 font-bold text-[12px] px-2.5 py-0.5 rounded-[6px]"
                          style={{
                            color: row.processingColor,
                            background: `color-mix(in srgb, ${row.processingColor} 10%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${row.processingColor} 20%, transparent)`
                          }}
                        >
                          <Clock size={11} strokeWidth={2.5} />
                          {row[c.key]}
                        </span>
                      ) : (c.key === 'depositFee' || c.key === 'withdrawFee') ? (
                        <span
                          className="font-mono font-black text-[11px] px-2 py-0.5 rounded-[6px] border"
                          style={{
                            color: row[c.key] === 'Free' || row[c.key] === '0%'
                              ? 'var(--positive)'
                              : 'var(--warning)',
                            background: row[c.key] === 'Free' || row[c.key] === '0%'
                              ? 'color-mix(in srgb, var(--positive) 8%, transparent)'
                              : 'color-mix(in srgb, var(--warning) 8%, transparent)',
                            borderColor: row[c.key] === 'Free' || row[c.key] === '0%'
                              ? 'color-mix(in srgb, var(--positive) 20%, transparent)'
                              : 'color-mix(in srgb, var(--warning) 20%, transparent)',
                          }}
                        >
                          {row[c.key]}
                        </span>
                      ) : (
                        <span className="font-mono text-[12px] font-bold text-text-muted">
                          {row[c.key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supported currencies */}
      <div className="bg-surface-elevated border border-border/40 shadow-card-subtle rounded-[16px] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] mb-4 text-text-muted/60">
          Supported Currencies
        </p>
        <div className="flex flex-wrap gap-2.5">
          {CURRENCIES.map((c) => (
            <div
              key={c.code}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] bg-muted-surface/30 border border-border/40 hover:border-brand/40 hover:bg-muted-surface/60 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <span className="text-[16px] select-none">{c.flag}</span>
              <div>
                <p className="text-[11.5px] font-bold text-text leading-none">{c.code}</p>
                <p className="text-[9.5px] text-text-muted/70 mt-1 leading-none">{c.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
