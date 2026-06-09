import React, { useState } from 'react';
import { Shield, KeyRound, AlertCircle, CheckCircle2, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * WithdrawConfirmStep
 * Security confirmation (password + optional 2FA) + final review summary before submit.
 */
export function WithdrawConfirmStep({ method, amount, destination, onSubmit, isSubmitting }) {
  const navigate        = useNavigate();
  const [password, setPassword] = useState('');
  const [twoFA, setTwoFA]       = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [has2FA]                = useState(false); // TODO: derive from user session
  const [submitted, setSubmitted] = useState(false);
  const [refId]                 = useState(() => `WD-2026-${String(Math.floor(10000 + Math.random() * 90000))}`);

  const num     = parseFloat(amount) || 0;
  const FEE     = { bank: 5, crypto: 0, card: num * 0.015 };
  const fee     = FEE[method] ?? 0;
  const receive = num - fee;

  const isValid = password.length >= 6 && (!has2FA || twoFA.length === 6);

  const handleSubmit = () => {
    if (!isValid) return;
    setSubmitted(true);
    onSubmit?.({ method, amount, destination, password, twoFA, refId });
  };

  // Success state
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--positive) 12%, transparent)', border: '2px solid color-mix(in srgb, var(--positive) 25%, transparent)' }}
        >
          <CheckCircle2 size={40} style={{ color: 'var(--positive)' }} strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="font-heading font-black text-[20px] tracking-[-0.04em]" style={{ color: 'var(--text)' }}>
            Request Submitted!
          </h3>
          <p className="text-[13px] mt-1.5" style={{ color: 'rgba(194,198,214,0.55)' }}>
            Your withdrawal is being reviewed. You'll receive an email confirmation shortly.
          </p>
        </div>
        <div
          className="w-full rounded-[12px] p-4 flex items-center justify-between"
          style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)' }}
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] mb-0.5" style={{ color: 'rgba(194,198,214,0.4)' }}>
              Reference ID
            </p>
            <p className="font-mono font-bold text-[15px]" style={{ color: 'var(--brand)' }}>
              {refId}
            </p>
          </div>
          <span
            className="px-2.5 py-1 rounded-[7px] text-[10px] font-black uppercase tracking-[0.1em]"
            style={{ background: 'color-mix(in srgb, var(--warning) 10%, transparent)', color: 'var(--warning)' }}
          >
            Pending Review
          </span>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={() => navigate('/client/finance/wallets')}
            className="flex-1 h-11 rounded-[12px] font-bold text-[13.5px] transition-all duration-200 cursor-pointer"
            style={{ background: 'var(--brand)', color: 'var(--text-on-accent)' }}
          >
            Back to Wallet
          </button>
          <button
            onClick={() => navigate('/client/finance/transactions')}
            className="flex-1 h-11 rounded-[12px] font-bold text-[13.5px] transition-all duration-200 cursor-pointer"
            style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            View Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary card */}
      <div
        className="rounded-[14px] overflow-hidden"
        style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)' }}
      >
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(66,71,84,0.12)' }}>
          <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
            Review Your Withdrawal
          </p>
        </div>
        {[
          { label: 'Method',        value: method === 'bank' ? 'Bank Transfer' : method === 'crypto' ? 'Cryptocurrency' : 'Card Refund' },
          { label: 'Destination',   value: destination || 'Primary Bank Account' },
          { label: 'Amount',        value: `$${num.toFixed(2)}` },
          { label: 'Fee',           value: fee > 0 ? `-$${fee.toFixed(2)}` : 'Free', color: fee > 0 ? 'var(--negative)' : 'var(--positive)' },
          { label: 'You Receive',   value: `$${receive.toFixed(2)}`, color: 'var(--positive)', bold: true },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(66,71,84,0.08)' : 'none' }}
          >
            <span className="text-[12.5px]" style={{ color: 'rgba(194,198,214,0.5)' }}>{row.label}</span>
            <span
              className={`font-mono text-[13px] ${row.bold ? 'font-black' : 'font-semibold'}`}
              style={{ color: row.color ?? 'var(--text)' }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
          Confirm Your Password
        </label>
        <div className="relative">
          <Shield size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(194,198,214,0.35)' }} strokeWidth={2} />
          <input
            id="withdraw-password-input"
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full h-11 pl-9 pr-10 rounded-[11px] text-[13.5px] outline-none transition-all duration-200"
            style={{ background: 'var(--muted-surface)', border: '1.5px solid rgba(173,198,255,0.09)', color: 'var(--text)', caretColor: 'var(--brand)' }}
          />
          <button
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-150 hover:opacity-70"
            style={{ color: 'rgba(194,198,214,0.4)' }}
          >
            {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* 2FA field or nudge */}
      {has2FA ? (
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
            Two-Factor Authentication Code
          </label>
          <div className="relative">
            <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(194,198,214,0.35)' }} strokeWidth={2} />
            <input
              id="withdraw-2fa-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={twoFA}
              onChange={(e) => setTwoFA(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full h-11 pl-9 pr-4 rounded-[11px] font-mono text-[16px] tracking-[0.2em] text-center outline-none transition-all duration-200"
              style={{ background: 'var(--muted-surface)', border: '1.5px solid rgba(173,198,255,0.09)', color: 'var(--text)', caretColor: 'var(--brand)' }}
            />
          </div>
        </div>
      ) : (
        <div
          className="flex items-start gap-2.5 p-3.5 rounded-[10px] text-[12px]"
          style={{ background: 'color-mix(in srgb, var(--warning) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--warning) 15%, transparent)', color: 'rgba(194,198,214,0.65)' }}
        >
          <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} strokeWidth={2} />
          <span>
            2FA is not enabled on your account. <button
              onClick={() => navigate('/client/account/security')}
              className="underline cursor-pointer"
              style={{ color: 'var(--brand)' }}
            >
              Enable 2FA
            </button> for enhanced security.
          </span>
        </div>
      )}

      {/* Submit */}
      <button
        id="withdraw-submit-btn"
        disabled={!isValid || isSubmitting}
        onClick={handleSubmit}
        className="w-full rounded-[13px] font-bold text-[14.5px] tracking-[-0.02em] transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          height: '52px',
          background: 'var(--brand)',
          color: 'var(--text-on-accent)',
          boxShadow: isValid ? '0 4px 16px color-mix(in srgb, var(--brand) 35%, transparent)' : 'none',
        }}
      >
        <ChevronRight size={17} strokeWidth={2.5} />
        {isSubmitting ? 'Processing…' : 'Submit Withdrawal Request'}
      </button>
    </div>
  );
}
