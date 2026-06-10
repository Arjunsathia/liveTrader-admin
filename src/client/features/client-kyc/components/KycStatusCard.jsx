import React from 'react';
import {
  ShieldCheck, Clock3, ArrowRight, CircleAlert,
  CheckCircle2, LoaderCircle, Shield, RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_MAP = {
  'not-started': {
    label: 'Not Started', badge: 'bg-warning/10 text-warning border-warning/20',
    Icon: CircleAlert, cta: 'Start verification', href: '/client/kyc/upload',
    note: 'Complete identity verification to unlock full funding limits and withdrawals.',
  },
  pending: {
    label: 'Incomplete', badge: 'bg-warning/10 text-warning border-warning/20',
    Icon: Clock3, cta: 'Continue verification', href: '/client/kyc/upload',
    note: 'You have unfinished steps. Continue where you left off to complete verification.',
  },
  'under-review': {
    label: 'Under Review', badge: 'bg-brand/10 text-brand border-brand/20',
    Icon: LoaderCircle, cta: 'View submission', href: '/client/kyc/status',
    note: 'Your documents are being reviewed by our compliance team.',
  },
  verified: {
    label: 'Verified', badge: 'bg-positive/10 text-positive border-positive/20',
    Icon: CheckCircle2, cta: 'View details', href: '/client/kyc/status',
    note: 'Identity fully verified. All trading features are unlocked.',
  },
  rejected: {
    label: 'Action Required', badge: 'bg-negative/10 text-negative border-negative/20',
    Icon: CircleAlert, cta: 'Resubmit documents', href: '/client/kyc/upload',
    note: 'Your submission was rejected. Review the feedback below and resubmit.',
  },
};

const LEVEL_MAP = {
  Basic: { limit: '$5,000/day', cls: 'bg-warning/10 text-warning border-warning/20' },
  Advanced: { limit: '$50,000/day', cls: 'bg-brand/10 text-brand border-brand/20' },
  Full: { limit: 'Unlimited', cls: 'bg-positive/10 text-positive border-positive/20' },
};

export function KycStatusCard({ overview }) {
  const navigate = useNavigate();
  const key = overview?.status ?? 'not-started';
  const st = STATUS_MAP[key] ?? STATUS_MAP['not-started'];
  const level = overview?.level ?? 'Basic';
  const lv = LEVEL_MAP[level] ?? LEVEL_MAP.Basic;
  const progress = overview?.progress ?? 0;
  const reviewTime = overview?.reviewTime ?? '1–3 business days';

  return (
    <div className="rounded-[16px] border border-brand/15 bg-gradient-to-br from-brand/[0.1] via-surface-elevated to-surface-elevated p-6 md:p-7 shadow-card-subtle">

      {/* ── Top row ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-[13px] bg-brand/15 text-brand flex items-center justify-center shrink-0">
            <ShieldCheck size={23} />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h2 className="font-heading font-semibold text-[20px] tracking-[-0.03em]">Identity verification</h2>
              <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5 ${st.badge}`}>
                <st.Icon size={10} /> {st.label}
              </span>
            </div>
            <p className="text-[12.5px] text-text-muted max-w-md leading-relaxed">{st.note}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full border ${lv.cls}`}>
                <Shield size={10} /> {level} · {lv.limit}
              </span>
              {key === 'under-review' && (
                <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-text-muted">
                  <Clock3 size={11} /> Est. {reviewTime}
                </span>
              )}
            </div>
          </div>
        </div>

        <button onClick={() => navigate(st.href)}
          className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent font-bold text-[12px] flex items-center justify-center gap-2 shrink-0 hover:opacity-90 transition-opacity">
          {key === 'rejected' && <RefreshCw size={13} />}
          {st.cta}
          {key !== 'rejected' && <ArrowRight size={13} />}
        </button>
      </div>

      {/* ── Progress bar ── */}
      {key !== 'verified' ? (
        <div className="mt-6 pt-5 border-t border-border/20">
          <div className="flex justify-between items-center text-[11px] mb-2">
            <span className="font-bold">{progress}% complete</span>
            <span className="text-text-muted">
              {key === 'under-review' ? 'Submitted · pending compliance review' : 'Continue to unlock higher limits'}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted-surface overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${key === 'rejected' ? 'bg-negative' : 'bg-brand'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 pt-5 border-t border-border/20 flex items-center gap-3">
          <CheckCircle2 size={14} className="text-positive shrink-0" />
          <p className="text-[12px] text-text-muted">All verification levels complete · Full trading access enabled</p>
        </div>
      )}
    </div>
  );
}