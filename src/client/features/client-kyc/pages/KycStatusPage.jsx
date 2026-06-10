import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock3, Check, ShieldCheck, FileSearch, Bell,
  ArrowLeft, AlertTriangle, LockKeyhole, RefreshCw, ArrowRight,
} from 'lucide-react';
import { useKyc } from '../hooks/useKyc';

/* ── Status config ── */
const STATUS_CFG = {
  verified: {
    eyebrow: 'Fully verified',
    headline: 'Your identity is verified',
    sub: 'Full access to all trading features, higher funding limits, and withdrawals is enabled.',
    iconCls: 'bg-positive/12 text-positive',
    Icon: Check,
  },
  rejected: {
    eyebrow: 'Action required',
    headline: 'Verification needs attention',
    sub: 'Your submission was rejected. Review the reason below and resubmit corrected documents.',
    iconCls: 'bg-negative/12 text-negative',
    Icon: AlertTriangle,
  },
  'under-review': {
    eyebrow: 'Under review',
    headline: 'Your verification is being reviewed',
    sub: 'Our compliance team is reviewing your documents. We will notify you by email when complete.',
    iconCls: 'bg-brand/12 text-brand',
    Icon: Clock3,
  },
  pending: {
    eyebrow: 'In progress',
    headline: 'Your verification is being reviewed',
    sub: 'Your documents are being processed. Estimated review time: 1–3 business days.',
    iconCls: 'bg-brand/12 text-brand',
    Icon: Clock3,
  },
};

export function KycStatusPage() {
  const navigate = useNavigate();
  const { overview, loading, error } = useKyc();

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="max-w-[850px] mx-auto space-y-5 px-4 sm:px-6 animate-pulse">
        <div className="h-4 w-36 bg-muted-surface rounded-full" />
        <div className="h-52 bg-surface-elevated rounded-[16px]" />
        <div className="h-64 bg-surface-elevated rounded-[12px]" />
      </div>
    );
  }

  /* ── Error ── */
  if (error || !overview) {
    return (
      <div className="max-w-[850px] mx-auto flex flex-col items-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-negative/10 flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-negative" />
        </div>
        <p className="text-[14px] font-bold mb-1">Unable to load status</p>
        <p className="text-[12.5px] text-text-muted mb-5">
          Please try again or return to the overview.
        </p>
        <button
          onClick={() => navigate('/client/kyc')}
          className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12px] font-bold hover:opacity-90 transition-opacity"
        >
          Back to overview
        </button>
      </div>
    );
  }

  const status = overview.status ?? 'under-review';
  const cfg = STATUS_CFG[status] ?? STATUS_CFG['under-review'];
  const isVerified = status === 'verified';
  const isRejected = status === 'rejected';
  const isActive = status === 'under-review' || status === 'pending';

  const STAGES = [
    {
      title: 'Documents received',
      desc: 'Your files were encrypted and securely received.',
      Icon: Check,
      done: true,
      warn: false,
    },
    {
      title: 'Compliance review',
      desc: isRejected
        ? 'Verification did not pass. Resubmit corrected documents.'
        : 'Automated and specialist checks are in progress.',
      Icon: FileSearch,
      done: isActive || isRejected || isVerified,
      warn: isRejected,
    },
    {
      title: 'Decision notification',
      desc: isVerified
        ? 'Identity confirmed — full trading access enabled.'
        : isRejected
          ? 'Action is required from you to proceed.'
          : 'You will be notified by email and in-platform.',
      Icon: Bell,
      done: isVerified || isRejected,
      warn: isRejected,
    },
  ];

  return (
    <div className="max-w-[850px] mx-auto space-y-5 px-4 sm:px-6">

      {/* ── Back nav ── */}
      <button
        onClick={() => navigate('/client/kyc')}
        className="flex items-center gap-2 text-[11.5px] font-bold text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={13} /> Verification overview
      </button>

      {/* ── Status hero ── */}
      <div className="rounded-[16px] border border-border/30 bg-surface-elevated p-7 text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 ${cfg.iconCls}`}>
          <cfg.Icon size={26} />
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.13em] text-brand">
          {cfg.eyebrow}
        </p>
        <h1 className="font-heading font-semibold text-[24px] tracking-[-0.03em] text-text mt-1.5 mb-2">
          {cfg.headline}
        </h1>
        <p className="text-[13px] text-text-muted max-w-md mx-auto leading-relaxed">{cfg.sub}</p>

        {/* Reference number */}
        {overview.reference && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted-surface border border-border/30">
            <span className="text-[9.5px] font-black uppercase tracking-[0.1em] text-text-muted">Ref</span>
            <span className="font-mono text-[11px] text-text">{overview.reference}</span>
          </div>
        )}

        {/* Review ETA */}
        {isActive && overview.estimatedReviewTime && (
          <p className="mt-3 text-[11.5px] text-text-muted">
            Estimated completion:{' '}
            <span className="font-bold text-text">{overview.estimatedReviewTime}</span>
          </p>
        )}
      </div>

      {/* ── Process timeline ── */}
      <div className="rounded-[12px] border border-border/35 bg-surface-elevated p-6">
        <h2 className="font-heading font-semibold text-[15px] text-text mb-6">
          {isRejected ? 'What went wrong' : 'What happens next'}
        </h2>

        <div>
          {STAGES.map(({ title, desc, Icon, done, warn }, i) => (
            <div key={title} className="flex gap-4">

              {/* Icon + connector */}
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${warn ? 'bg-negative/12 text-negative'
                  : done ? 'bg-positive/12 text-positive'
                    : 'bg-muted-surface text-text-muted'
                  }`}>
                  <Icon size={15} />
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`w-px flex-1 min-h-[28px] my-1 ${done ? 'bg-border/50' : 'bg-border/20'}`} />
                )}
              </div>

              {/* Content */}
              <div className="pb-5 pt-1.5">
                <p className="text-[12.5px] font-bold text-text leading-tight">{title}</p>
                <p className="text-[11.5px] text-text-muted mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rejection action ── */}
      {isRejected && (
        <div className="rounded-[12px] border border-negative/25 bg-negative/[0.05] p-5">
          <p className="text-[12.5px] font-bold text-negative mb-1">Action required</p>
          {overview.rejectionReason && (
            <p className="text-[12px] text-text-muted mb-4 leading-relaxed">
              {overview.rejectionReason}
            </p>
          )}
          <button
            onClick={() => navigate('/client/kyc/upload?reupload=true')}
            className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={13} /> Resubmit documents
          </button>
        </div>
      )}

      {/* ── Verified action ── */}
      {isVerified && (
        <div className="rounded-[12px] border border-positive/25 bg-positive/[0.05] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-positive shrink-0" />
            <p className="text-[12.5px] font-bold text-positive">
              Identity verified — full trading access is enabled
            </p>
          </div>
          <button
            onClick={() => navigate('/client/trading')}
            className="h-9 px-4 rounded-[8px] bg-positive text-white text-[11.5px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
          >
            Start trading <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* ── Encryption note ── */}
      <div className="flex items-center gap-3 rounded-[11px] border border-border/30 bg-surface p-4">
        <LockKeyhole size={14} className="text-brand shrink-0" />
        <p className="text-[11.5px] text-text-muted">
          Your uploaded files are AES-256 encrypted and cannot be modified while under review.
        </p>
      </div>
    </div>
  );
}

export default KycStatusPage;