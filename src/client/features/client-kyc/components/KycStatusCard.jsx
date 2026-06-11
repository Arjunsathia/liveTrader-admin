import React from 'react';
import {
  ShieldCheck, Clock3, ArrowRight, CircleAlert,
  CheckCircle2, LoaderCircle, Shield, RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_MAP = {
  'not-started': {
    label: 'Not Started', badge: 'bg-warning/10 text-warning border-warning/20',
    Icon: CircleAlert, cta: 'Start', href: '/client/kyc/upload',
    note: 'Verify your identity to increase your trading limits and withdraw money.',
  },
  pending: {
    label: 'Incomplete', badge: 'bg-warning/10 text-warning border-warning/20',
    Icon: Clock3, cta: 'Continue', href: '/client/kyc/upload',
    note: 'Please complete the remaining steps to finish verifying your account.',
  },
  'under-review': {
    label: 'Under Review', badge: 'bg-brand/10 text-brand border-brand/20',
    Icon: LoaderCircle, cta: 'View upload', href: '/client/kyc/status',
    note: 'We are checking your documents. This usually takes 1-3 business days.',
  },
  verified: {
    label: 'Verified', badge: 'bg-positive/10 text-positive border-positive/20',
    Icon: CheckCircle2, cta: 'View details', href: '/client/kyc/status',
    note: 'Your account is verified! All trading features are now open.',
  },
  rejected: {
    label: 'Action Required', badge: 'bg-negative/10 text-negative border-negative/20',
    Icon: CircleAlert, cta: 'Try again', href: '/client/kyc/upload',
    note: 'There was an issue with your documents. Please check the reason and try again.',
  },
};

const LEVEL_MAP = {
  Basic: { limit: '$5,000 / day', cls: 'bg-warning/10 text-warning border-warning/20', label: 'Level 1' },
  Advanced: { limit: '$50,000 / day', cls: 'bg-brand/10 text-brand border-brand/20', label: 'Level 2' },
  Standard: { limit: '$50,000 / day', cls: 'bg-brand/10 text-brand border-brand/20', label: 'Level 2' },
  Full: { limit: 'No limit', cls: 'bg-positive/10 text-positive border-positive/20', label: 'Level 3' },
  Premium: { limit: 'No limit', cls: 'bg-positive/10 text-positive border-positive/20', label: 'Level 3' },
};

export function KycStatusCard({ overview }) {
  const navigate = useNavigate();
  const key = overview?.status ?? 'not-started';
  const st = STATUS_MAP[key] ?? STATUS_MAP['not-started'];
  const level = overview?.level ?? 'Basic';
  const lv = LEVEL_MAP[level] ?? LEVEL_MAP.Basic;
  const progress = overview?.progress ?? 0;
  const reviewTime = overview?.reviewTime ?? '1–3 business days';

  // SVG parameters for radial progress circle
  const radius = 32;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI; // ~138.2
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative rounded-[16px] border border-border/30 bg-surface-elevated p-6 shadow-card-subtle overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-20 -top-20 w-52 h-52 bg-brand/5 rounded-full blur-[70px] pointer-events-none" />

      {/* ── Main Flex Layout ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Status Info */}
        <div className="flex items-start gap-4 flex-1 text-left">
          <div className="w-12 h-12 rounded-[13px] bg-brand/10 text-brand flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.05)]">
            <ShieldCheck size={23} />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2.5 mb-1.5">
              <h2 className="font-heading font-semibold text-[20px] tracking-[-0.03em] text-text">Identity verification</h2>
              <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5 ${st.badge}`}>
                <st.Icon size={10} className={key === 'under-review' ? 'animate-spin' : ''} /> {st.label}
              </span>
            </div>
            <p className="text-[12.5px] text-text-muted max-w-md leading-relaxed">{st.note}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3.5">
              <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full border ${lv.cls}`}>
                <Shield size={10} /> {lv.label} · {lv.limit}
              </span>
              {key === 'under-review' && (
                <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-text-muted">
                  <Clock3 size={11} /> Est. {reviewTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Radial Progress Circle & CTA */}
        <div className="flex items-center gap-6 self-start md:self-center shrink-0">
          
          {/* Radial progress ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
              {/* Background circle */}
              <circle
                className="text-border/10"
                strokeWidth={stroke}
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx="32"
                cy="32"
              />
              {/* Foreground circle */}
              <circle
                className={`transition-all duration-700 ease-in-out ${key === 'rejected' ? 'text-negative' : 'text-brand'}`}
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx="32"
                cy="32"
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center justify-center">
              <span className="text-[11.5px] font-bold tracking-tight text-text leading-none">{progress}%</span>
              <span className="text-[7px] text-text-muted/60 font-black uppercase tracking-wider mt-px leading-none">Done</span>
            </div>
          </div>

          {/* Action button */}
          <button onClick={() => navigate(st.href)}
            className="h-10 px-5 rounded-[9px] bg-brand text-text-on-accent font-bold text-[12px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_14px_rgba(var(--color-primary-rgb),0.1)] cursor-pointer">
            {key === 'rejected' && <RefreshCw size={13} />}
            {st.cta}
            {key !== 'rejected' && <ArrowRight size={13} />}
          </button>
        </div>

      </div>

    </div>
  );
}