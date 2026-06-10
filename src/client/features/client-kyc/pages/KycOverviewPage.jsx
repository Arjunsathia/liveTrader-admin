import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Clock3, Layers3, ListChecks,
  History, ShieldCheck, RefreshCw,
} from 'lucide-react';
import { KycStatusCard } from '../components/KycStatusCard';
import { KycRequirementsBox } from '../components/KycRequirementsBox';
import { KycHelpBox } from '../components/KycHelpBox';
import { useKyc } from '../hooks/useKyc';

export function KycOverviewPage() {
  const navigate = useNavigate();
  const { overview, loading, error } = useKyc();

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="max-w-[1180px] mx-auto space-y-5 px-4 sm:px-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-muted-surface rounded-full" />
          <div className="h-8 w-56 bg-muted-surface rounded-[9px]" />
        </div>
        <div className="h-[148px] w-full bg-surface-elevated rounded-[16px]" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-surface-elevated rounded-[12px]" />)}
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="h-52 bg-surface-elevated rounded-[12px]" />
          <div className="h-52 bg-surface-elevated rounded-[12px]" />
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="max-w-[1180px] mx-auto flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-negative/10 flex items-center justify-center mb-4">
          <ShieldCheck size={24} className="text-negative" />
        </div>
        <p className="text-[14px] font-bold text-text mb-1">Failed to load verification</p>
        <p className="text-[12.5px] text-text-muted mb-5">
          Unable to retrieve your KYC status. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    );
  }

  /* ── Derive step state from progress ── */
  const progress = overview?.progress ?? 0;
  const completedSteps = [progress >= 25, progress >= 50, progress >= 75, progress >= 100];
  const currentStep = Math.min(completedSteps.filter(Boolean).length + 1, 4);
  const canContinue = overview?.status !== 'verified';

  const INFO_CARDS = [
    {
      Icon: Layers3,
      label: 'Verification level',
      value: overview?.level ?? 'Basic',
    },
    {
      Icon: Clock3,
      label: 'Estimated review time',
      value: overview?.estimatedReviewTime ?? '1–3 business days',
    },
    {
      Icon: ListChecks,
      label: 'Next required step',
      value: overview?.nextStep ?? 'Start verification',
    },
  ];

  return (
    <div className="max-w-[1180px] mx-auto space-y-5 px-4 sm:px-6">

      {/* ── Page header ── */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted">
          Account security
        </p>
        <h1 className="font-heading font-semibold text-[27px] tracking-[-0.04em] text-text mt-0.5">
          Identity verification
        </h1>
        <p className="text-[13px] text-text-muted mt-1">
          A secure, guided process designed to protect your account and trading activity.
        </p>
      </div>

      {/* ── Status hero ── */}
      <KycStatusCard overview={overview} />

      {/* ── Info grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {INFO_CARDS.map(({ Icon, label, value }) => (
          <div
            key={label}
            className="rounded-[12px] border border-border/35 bg-surface-elevated p-5"
          >
            <div className="w-8 h-8 rounded-[8px] bg-brand/10 flex items-center justify-center mb-4">
              <Icon size={15} className="text-brand" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-text-muted">
              {label}
            </p>
            <p className="text-[13.5px] font-bold mt-1 text-text">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Requirements + Help ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <KycRequirementsBox completed={completedSteps} current={currentStep} />
        <KycHelpBox />
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-wrap gap-3 pb-2">
        {canContinue && (
          <button
            onClick={() => navigate('/client/kyc/upload')}
            className="h-11 px-5 rounded-[10px] bg-brand text-text-on-accent text-[12.5px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            {progress > 0 ? 'Continue verification' : 'Start verification'}
            <ArrowRight size={14} />
          </button>
        )}
        <button
          onClick={() => navigate('/client/kyc/history')}
          className="h-11 px-5 rounded-[10px] border border-border/40 bg-surface-elevated text-[12.5px] font-bold flex items-center gap-2 hover:bg-muted-surface/50 transition-colors"
        >
          <History size={14} /> Submission history
        </button>
      </div>
    </div>
  );
}

export default KycOverviewPage;