/**
 * WithdrawPage.jsx — Live-Trader Customer Withdrawal Flow
 *
 * Design system: dark premium fintech (Syne + DM Sans + DM Mono)
 * Requires: react-router-dom, lucide-react
 * Centered side-by-side layout matching DepositPage.jsx.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { WithdrawMethodSelector } from '../components/WithdrawMethodSelector';
import { WithdrawAmountForm } from '../components/WithdrawAmountForm';
import { WithdrawConfirmStep } from '../components/WithdrawConfirmStep';

const STEPS = [
  { id: 1, label: 'Method' },
  { id: 2, label: 'Amount' },
  { id: 3, label: 'Confirm' },
];

const SAVED_DESTINATIONS = {
  bank: ['HDFC Bank — ••••5678 (Primary)', 'Citibank — ••••1234'],
  crypto: ['USDT-TRC20 — TQn9Y2…hfNa', 'ETH — 0xde0B…BAe'],
  card: ['Visa •••• 4242 (Original card)'],
};

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-between w-full border-b border-border/10 pb-5 mb-5">
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;

        const dotBg = done ? 'var(--positive)' : active ? 'var(--brand)' : 'var(--surface-2)';
        const dotClr = done || active ? 'var(--text-on-accent)' : 'var(--text-muted)';
        const dotBd = done
          ? '2px solid color-mix(in srgb, var(--positive) 25%, transparent)'
          : active
          ? '2.5px solid color-mix(in srgb, var(--brand) 30%, transparent)'
          : '1.5px solid var(--border)';
        const dotShad = active ? '0 0 12px color-mix(in srgb, var(--brand) 25%, transparent)' : 'none';
        const lblClr = active ? 'var(--brand)' : done ? 'var(--positive)' : 'var(--text-muted)';

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2 shrink-0">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-black transition-all duration-300"
                style={{
                  background: dotBg,
                  color: dotClr,
                  border: dotBd,
                  boxShadow: dotShad,
                }}
              >
                {done ? <Check size={12} strokeWidth={3} /> : step.id}
              </div>
              <span 
                className="text-[10px] font-bold uppercase tracking-[0.08em] hidden sm:inline"
                style={{ color: lblClr }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div 
                className="flex-1 h-[2px] mx-2 transition-all duration-300"
                style={{
                  background: step.id < current
                    ? 'var(--positive)'
                    : 'var(--border)',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const SEC_ITEMS = [
  { text: 'Password-secured request' },
  { text: 'Reviewed in 1 business day' },
  { text: 'Email confirmation sent' },
];

function SummarySidebar({ method, destination, amount, availableBalance, step }) {
  const num = parseFloat(amount) || 0;

  const rows = [
    { label: 'Method', value: method === 'bank' ? 'Bank Transfer' : method === 'crypto' ? 'Crypto' : 'Card Refund' },
    { label: 'Destination', value: destination || '—' },
    { label: 'Amount', value: num > 0 ? `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—' },
    { label: 'Available', value: `$${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: 'Step', value: `${step} of ${STEPS.length}` },
  ];

  return (
    <Card heading="Withdrawal Summary" className="h-full">
      <div className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <div 
            key={r.label} 
            className="flex justify-between items-center py-2.5 border-b border-border/10 last:border-0"
          >
            <span className="text-[12px] text-text-muted shrink-0">{r.label}</span>
            <span className="font-mono text-[12px] font-bold text-text text-right truncate max-w-[150px]">
              {r.value}
            </span>
          </div>
        ))}

        <div className="pt-4 border-t border-border/10 flex flex-col gap-2">
          {SEC_ITEMS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-text-muted/60">
              <span className="text-positive">✓</span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function DestinationCard({ method, destination, step, onChange, onAddNew }) {
  const destinations = SAVED_DESTINATIONS[method] ?? [];

  if (step > 1) {
    return (
      <Card heading="Destination" padding={false} className="w-full">
        <div className="p-3">
          <div className="flex items-center gap-2.5 p-2.5 rounded-[8px] bg-brand/5 border border-brand/12">
            <div className="w-6 h-6 rounded-[6px] bg-brand/10 text-brand flex items-center justify-center font-bold text-[11px] shrink-0">
              ✓
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-brand leading-none">Selected</p>
              <p className="text-[11.5px] font-bold text-text truncate mt-1">{destination || '—'}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card heading="Select Destination" padding={false} className="w-full">
      <div className="p-3 flex flex-col gap-2">
        {destinations.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {destinations.map((d) => {
              const isSelected = destination === d;
              return (
                <button
                  key={d}
                  onClick={() => onChange(d)}
                  className="flex items-center gap-2.5 p-2 rounded-[8px] transition-all duration-200 cursor-pointer text-left w-full outline-none"
                  style={{
                    background: isSelected ? 'color-mix(in srgb, var(--brand) 7%, transparent)' : 'var(--surface-2)',
                    border: `1px solid ${isSelected ? 'color-mix(in srgb, var(--brand) 22%, transparent)' : 'transparent'}`,
                  }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: isSelected ? 'var(--brand)' : 'var(--border)' }}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand)' }} />}
                  </div>
                  <span className="text-[11.5px] font-medium text-text truncate leading-none">{d}</span>
                </button>
              );
            })}
            <button
              onClick={onAddNew}
              className="flex items-center gap-1.5 p-1 rounded-[6px] text-[10.5px] font-bold cursor-pointer transition-all duration-150 hover:opacity-85 text-brand self-start"
            >
              + Add New
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-text-muted/50 py-3 text-center">
            No saved destinations
          </div>
        )}
      </div>
    </Card>
  );
}

export function WithdrawPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('bank');
  const [destination, setDestination] = useState(SAVED_DESTINATIONS.bank[0] || '');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const availableBalance = 72500.00; // TODO: load from API
  const destinations = SAVED_DESTINATIONS[method] ?? [];

  const handleSubmit = (data) => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/client/finance/wallets');
    }, 1500); // TODO: replace with API call
  };

  return (
    <div className="animate-fade-up max-w-[1100px] mx-auto w-full">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-5 border-b border-border/10 pb-3.5">
        <div>
          <p className="text-section-eyebrow">Financials</p>
          <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] leading-tight text-text mt-0.5">
            Withdraw Funds
          </h1>
        </div>
        <span className="text-[11px] font-bold font-mono text-text-muted bg-surface-elevated border border-border px-2.5 py-1 rounded-[6px]">
          Step {step} of 3
        </span>
      </div>

      {/* ── 3-Column Centered Flex Layout ── */}
      <div className="flex flex-col md:flex-row gap-5 items-start justify-center">
        {/* Left column: Select Destination */}
        <div className="w-full md:w-[200px] shrink-0">
          <DestinationCard
            method={method}
            destination={destination}
            step={step}
            onChange={setDestination}
            onAddNew={() => navigate('/client/finance/payment-methods')}
          />
        </div>

        {/* Center column: Main form card */}
        <div className="flex-1 max-w-[580px] w-full">
          <Card padding={true} className="overflow-hidden">
            {/* Step Timeline Indicator */}
            <StepIndicator current={step} />

            {/* Step 1: Select Method & Destination */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/40 mb-3">
                    Select Withdrawal Method
                  </p>
                  <WithdrawMethodSelector
                    value={method}
                    onChange={(m) => {
                      setMethod(m);
                      const list = SAVED_DESTINATIONS[m] ?? [];
                      setDestination(list.length > 0 ? list[0] : '');
                    }}
                  />
                </div>

                <button
                  id="withdraw-step1-next-btn"
                  disabled={!destination && destinations.length > 0}
                  onClick={() => setStep(2)}
                  className="w-full h-12 rounded-[10px] font-bold text-[13.5px] transition-all duration-150 cursor-pointer bg-brand text-text-on-accent hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                  Continue to Amount
                </button>
              </div>
            )}

            {/* Step 2: Enter Amount */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <WithdrawAmountForm
                  method={method}
                  amount={amount}
                  onChange={setAmount}
                  availableBalance={availableBalance}
                />
                <button
                  id="withdraw-step2-next-btn"
                  disabled={!amount || parseFloat(amount) < 1}
                  onClick={() => setStep(3)}
                  className="w-full h-12 rounded-[10px] font-bold text-[13.5px] transition-all duration-150 cursor-pointer bg-brand text-text-on-accent hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                  Review Withdrawal
                </button>
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <WithdrawConfirmStep
                  method={method}
                  amount={amount}
                  destination={destination}
                  onSubmit={handleSubmit}
                  isSubmitting={submitting}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Right column: Summary sidebar */}
        <div className="w-full md:w-[280px] shrink-0">
          <SummarySidebar
            method={method}
            destination={destination}
            amount={amount}
            availableBalance={availableBalance}
            step={step}
          />
        </div>
      </div>
    </div>
  );
}

export default WithdrawPage;
